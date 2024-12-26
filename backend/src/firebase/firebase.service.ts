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
  async deleteRecord(recordId: string): Promise<void> {
    const firestore = this.getFirestore();
    try {
      const batch = firestore.batch();
      const recordDocRef = firestore.collection('Record').doc(recordId);
      batch.delete(recordDocRef);
      const recordOfUserQuery = await firestore
        .collection('RecordOfUser')
        .where('recordId', '==', recordId)
        .get();
      recordOfUserQuery.forEach((doc) => {
        batch.delete(doc.ref);
      });
      const recordSharedQuery = await firestore
        .collection('RecordShared')
        .where('recordId', '==', recordId)
        .get();
      recordSharedQuery.forEach((doc) => {
        batch.delete(doc.ref);
      });
      const noteOfRecordQuery = await firestore
        .collection('NoteOfRecord')
        .where('recordId', '==', recordId)
        .get();
      const noteIds: string[] = [];
      noteOfRecordQuery.forEach((doc) => {
        noteIds.push(doc.data().noteId);
        batch.delete(doc.ref);
      });

      for (const noteId of noteIds) {
        const noteDocRef = firestore.collection('Note').doc(noteId);
        batch.delete(noteDocRef);
      }
      await batch.commit();
      console.log(
        `Record with ID ${recordId} and related data deleted successfully`,
      );
    } catch (error) {
      console.error('Error deleting record and related data:', error);
      throw new InternalServerErrorException(
        'Failed to delete record and related data from Firestore',
      );
    }
  }
  async updateRecordName(recordId: string, newName: string): Promise<void> {
    const firestore = this.getFirestore();
    const recordRef = firestore.collection('Record').doc(recordId);

    try {
      const recordDoc = await recordRef.get();
      if (!recordDoc.exists) {
        throw new NotFoundException(`Record with ID ${recordId} not found`);
      }

      await recordRef.update({
        name: newName,
      });
      console.log(
        `Record with ID ${recordId} updated successfully with new name: ${newName}`,
      );
    } catch (error) {
      console.error('Error updating record name in Firestore:', error);
      throw new InternalServerErrorException('Failed to update record name');
    }
  }
  async getRecordsByUserId(userId: string): Promise<any> {
    const firestore = this.getFirestore();
    try {
      const recordOfUserQuery = await firestore
        .collection('RecordOfUser')
        .where('userId', '==', userId)
        .get();
      const recordIds: string[] = [];
      recordOfUserQuery.forEach((doc) => {
        recordIds.push(doc.data().recordId);
      });

      const records: any[] = [];
      for (const recordId of recordIds) {
        const recordDoc = await firestore
          .collection('Record')
          .doc(recordId)
          .get();
        if (recordDoc.exists) {
          const recordData = recordDoc.data();
          records.push({
            recordId,
            ...recordData,
          });
        }
      }
      return records;
    } catch (error) {
      console.error('Error fetching records:', error);
      throw new InternalServerErrorException('Failed to get records');
    }
  }
  async addSharedRecords(recordId: string, email: string): Promise<void> {
    try {
      const firestore = this.getFirestore();
      const userQuery = await firestore
        .collection('User')
        .where('username', '==', email)
        .get();

      if (userQuery.empty) {
        throw new NotFoundException('User not found');
      }

      const checkExists = await firestore
        .collection('RecordShared')
        .where('recordId', '==', recordId)
        .where('userId', '==', userQuery.docs[0].id)
        .get();

      if (!checkExists.empty) {
        throw new ConflictException('Record already shared with user');
      }

      const checkOwner = await firestore
        .collection('RecordOfUser')
        .where('recordId', '==', recordId)
        .where('userId', '==', userQuery.docs[0].id)
        .get();

      if (!checkOwner.empty) {
        throw new ConflictException('Record owner cannot be shared');
      }

      const batch = firestore.batch();
      //add record to firestore with userId
      const recordOfUserRef = firestore.collection('RecordShared').doc();
      batch.set(recordOfUserRef, {
        recordId,
        userId: userQuery.docs[0].id,
      });
      batch.commit();
    } catch (error) {
      console.error('Error adding shared records:', error);
      throw new InternalServerErrorException('Failed to add shared records');
    }
  }
  async getSharedRecords(userId: string): Promise<any> {
    const firestore = this.getFirestore();
    try {
      const recordSharedQuery = await firestore
        .collection('RecordShared')
        .where('userId', '==', userId)
        .get();
      const recordIds: string[] = [];
      recordSharedQuery.forEach((doc) => {
        recordIds.push(doc.data().recordId);
      });

      const records: any[] = [];
      for (const recordId of recordIds) {
        const recordDoc = await firestore
          .collection('Record')
          .doc(recordId)
          .get();
        if (recordDoc.exists) {
          const recordData = recordDoc.data();
          records.push({
            recordId,
            ...recordData,
          });
        }
      }
      return records;
    } catch (error) {
      console.error('Error fetching shared records:', error);
      throw new InternalServerErrorException('Failed to get shared records');
    }
  }
}
