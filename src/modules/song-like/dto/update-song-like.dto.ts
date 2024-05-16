import { PartialType } from '@nestjs/mapped-types';

import { CreateSongLikeDto } from './create-song-like.dto';

export class UpdateSongLikeDto extends PartialType(CreateSongLikeDto) {}
