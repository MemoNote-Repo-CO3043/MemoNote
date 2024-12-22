import {
  Injectable,
  Inject,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class FirebaseService {
  constructor(@Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: any) {}
  getFirestore() {
    return this.firebaseAdmin.firestore;
  }

  getStorage() {
    return this.firebaseAdmin.storage;
  }

  async addRecord(
    url: string,
    name: string,
    date: string,
    userId: string,
  ): Promise<string> {
    const firestore = this.getFirestore();
    const docRef = firestore.collection('Record').doc();

    try {
      await docRef.set({
        url,
        name,
        date,
      });
      const recordId = docRef.id;
      await firestore.collection('RecordOfUser').add({
        recordId,
        userId,
      });
      return recordId;
    } catch (error) {
      console.error('Error adding document to collection:', error);
      throw new Error('Failed to add record to Firestore');
    }
  }

  async uploadFile(filePath: string, fileBuffer: Buffer): Promise<string> {
    const bucket = this.getStorage().bucket();
    const file = bucket.file(filePath);

    try {
      await file.save(fileBuffer, {
        resumable: false,
        contentType: 'auto',
      });
      const encodedFilePath = encodeURIComponent(filePath);
      const fileURL = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedFilePath}?alt=media`;

      return fileURL;
    } catch (error) {
      console.error('Error uploading file to Firebase Storage:', error);
      throw new Error('Failed to upload file to Firebase Storage');
    }
  }

  async addNote(
    text: string,
    timestamp: number,
    tag: string,
    recordId: string,
  ): Promise<string> {
    const firestore = this.getFirestore();
    const docRef = firestore.collection('Note').doc();

    try {
      await docRef.set({
        text,
        timestamp,
        tag,
      });
      const noteId = docRef.id;
      await firestore.collection('NoteOfRecord').add({
        noteId,
        recordId,
      });
      return noteId;
    } catch (error) {
      console.error('Error adding document to collection:', error);
      throw new Error('Failed to add note to Firestore');
    }
  }
  async editNote(id: string, newText: string): Promise<void> {
    const firestore = this.getFirestore();
    const docRef = firestore.collection('Note').doc(id);
    try {
      await docRef.update({
        text: newText,
      });
      console.log(`Note with ID ${id} updated successfully`);
    } catch (error) {
      console.error('Error updating note in Firestore:', error);
      throw new InternalServerErrorException(
        'Failed to update note in Firestore',
      );
    }
  }
  async deleteNote(id: string): Promise<void> {
    const firestore = this.getFirestore();
    const docRef = firestore.collection('Note').doc(id);
    try {
      await docRef.delete();
      console.log(`Note with ID ${id} deleted successfully`);
      const noteOfRecordQuery = await firestore
        .collection('NoteOfRecord')
        .where('noteId', '==', id)
        .get();
      const batch = firestore.batch();
      noteOfRecordQuery.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      console.log(
        `Associated NoteOfRecord entries for note ID ${id} deleted successfully`,
      );
    } catch (error) {
      console.error('Error deleting note in Firestore:', error);
      throw new InternalServerErrorException(
        'Failed to delete note from Firestore',
      );
    }
  }
  async getRecord(recordId: string): Promise<any> {
    const firestore = this.getFirestore();
    try {
      const recordDoc = await firestore
        .collection('Record')
        .doc(recordId)
        .get();

      if (!recordDoc.exists) {
        throw new Error('Record not found');
      }

      const recordData = recordDoc.data();
      const noteOfRecordQuery = await firestore
        .collection('NoteOfRecord')
        .where('recordId', '==', recordId)
        .get();

      const noteIds: string[] = [];
      noteOfRecordQuery.forEach((doc) => {
        noteIds.push(doc.data().noteId);
      });

      const notes: any[] = [];
      for (const noteId of noteIds) {
        const noteDoc = await firestore.collection('Note').doc(noteId).get();
        if (noteDoc.exists) {
          const noteData = noteDoc.data();
          notes.push({
            noteId,
            ...noteData,
          });
        }
      }
      return {
        url: recordData?.url,
        name: recordData?.name,
        date: recordData?.date,
        notes: notes,
      };
    } catch (error) {
      console.error('Error fetching record and notes:', error);
      throw new InternalServerErrorException('Failed to get record and notes');
    }
  }

  async getUser(username: string): Promise<any> {
    const firestore = this.getFirestore();
    try {
      const userQuery = await firestore
        .collection('User')
        .where('username', '==', username)
        .get();
      if (userQuery.empty) {
        throw new NotFoundException('User not found');
      }
      const userData = userQuery.docs[0].data();
      return {
        userId: userQuery.docs[0].id,
        ...userData,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }
  async createUser(username: string, password: string): Promise<any> {
    const firestore = this.getFirestore();
    try {
      const userQuery = await firestore
        .collection('User')
        .where('username', '==', username)
        .get();
      if (!userQuery.empty) {
        throw new ConflictException('Username already exists');
      }
      const docRef = firestore.collection('User').doc();
      await docRef.set({
        username,
        password,
      });
      return {
        userId: docRef.id,
        username,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
