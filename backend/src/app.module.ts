import { Module } from '@nestjs/common';
import { FirebaseModule } from './firebase/firebase.module';
import { RecordController } from './record/record.controller';
import { NoteController } from './note/note.controller';
import { UserModule } from './user/user.module';
@Module({
  imports: [FirebaseModule, UserModule],
  controllers: [RecordController, NoteController],
  providers: [],
})
export class AppModule {}
