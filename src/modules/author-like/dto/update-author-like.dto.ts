import { PartialType } from '@nestjs/mapped-types';

import { CreateAuthorLikeDto } from './create-author-like.dto';

export class UpdateAuthorLikeDto extends PartialType(CreateAuthorLikeDto) {}
