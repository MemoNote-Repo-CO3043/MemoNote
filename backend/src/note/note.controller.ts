import { Controller, Post, Body, Get, Put, Delete } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

class CreateNoteDto {
  second: number;
  text: string;
  bookmark: string;
}
class UpdateNoteDto {
  id: string;
  text: string;
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
  @Put('editnote')
  async editNote(@Body() body: UpdateNoteDto) {
    const { id, text } = body;
    try {
      await this.firebaseService.editNote(id, text);
      return { message: 'Note updated successfully', id };
    } catch (error) {
      return { message: 'Failed to update note', error: error.message };
    }
  }
  @Delete('deletenote')
  async deleteNote(@Body() body: { id: string }) {
    const { id } = body;
    try {
      await this.firebaseService.deleteNote(id);
      return { message: 'Note deleted successfully', id };
    } catch (error) {
      return { message: 'Failed to delete note', error: error.message };
    }
  }
}
