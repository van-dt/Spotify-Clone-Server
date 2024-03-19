import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { SwaggerResponseSuccessDto } from '@core/swagger/response/index.response';

class VDetailPermissionPropertyResponse {
  @ApiProperty({ type: String })
  code!: string;

  @ApiProperty({ type: String })
  name!: string;
}

class VRolesPropertyResponse {
  @ApiProperty({ type: Number })
  roleId!: number;
}

class VPermissionsPropertyResponse {
  @ApiProperty({ type: String })
  permissionCode!: string;

  @ApiProperty({ type: VDetailPermissionPropertyResponse })
  permission!: VDetailPermissionPropertyResponse;
}

class VComposersPropertyResponse {
  @ApiProperty({ type: String })
  composerCode!: string;
}

class VGenresPropertyResponse {
  @ApiProperty({ type: String })
  genreCode!: string;
}

export class VProfilePropertyResponse {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  id!: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email!: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  avatarUrl: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  bannerUrl: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  viewCount: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  gender: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  birthday: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  firstNameFuri: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  lastNameFuri: string;

  @ApiProperty({ type: [VRolesPropertyResponse] })
  userRoles!: VRolesPropertyResponse[];

  @ApiProperty({ type: [VPermissionsPropertyResponse] })
  userPermissions!: VPermissionsPropertyResponse[];

  @ApiProperty({ type: [VComposersPropertyResponse] })
  userComposers!: VComposersPropertyResponse[];

  @ApiProperty({ type: [VGenresPropertyResponse] })
  userGenres!: VGenresPropertyResponse[];
}
export class VProfileResponse extends SwaggerResponseSuccessDto {
  @ApiProperty({ type: VProfilePropertyResponse })
  data!: VProfilePropertyResponse;
}
