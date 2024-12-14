import { Injectable, Inject } from '@nestjs/common';

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
}
