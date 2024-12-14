import { Module } from '@nestjs/common';
import { FirebaseModule } from './firebase/firebase.module';
import { RecordController } from './record/record.controller';
import { NoteController } from './note/note.controller';
@Module({
  imports: [FirebaseModule],
  controllers: [RecordController, NoteController],
  providers: [],
})
export class AppModule {}
