import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get env(): string {
    return this.configService.get<string>('app.env');
  }

  get name(): string {
    return this.configService.get<string>('app.name');
  }

  get url(): string {
    return this.configService.get<string>('app.url');
  }

  get port(): number {
    return Number(this.configService.get<string>('app.port'));
  }

  get jwtSecret(): string {
    return this.configService.get<string>('app.jwtSecret');
  }
}
