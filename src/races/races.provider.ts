import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class RacesProvider {
  private readonly logger = new Logger('Race provider');

  constructor(private readonly httpService: HttpService) {}

  async fetchFromApi<T>(url: string) {
    const { data } = await firstValueFrom(
      this.httpService.get<T>(url).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response?.data);
          throw new Error('Unexpected error happen');
        }),
      ),
    );
    return data;
  }
}
