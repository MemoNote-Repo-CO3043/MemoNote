import { Controller, Post, Body, Get } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

class CreateNoteDto {
  second: number;
  text: string;
  bookmark: string;
}
@Controller('note')
export class NoteController {
  constructor(private readonly firebaseService: FirebaseService) {}
  @Post('addnotes')
  async addNotes(@Body() body: { notes: CreateNoteDto[]; recordId: string }) {
    const { notes, recordId } = body;

    try {
      const noteIds = [];
      for (const note of notes) {
        const id = await this.firebaseService.addNote(
          note.text,
          note.second,
          note.bookmark,
          recordId,
        );
        noteIds.push(id);
      }
      return { message: 'Notes added successfully', noteIds };
    } catch (error) {
      return { message: 'Failed to add notes', error: error.message };
    }
  }
}
