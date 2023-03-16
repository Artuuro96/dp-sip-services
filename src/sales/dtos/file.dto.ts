import { IsDefined } from 'class-validator';

export class FileUploadDto {
  @IsDefined()
  fileImport: any;
}
