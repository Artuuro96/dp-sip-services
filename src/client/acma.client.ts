import { HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ConfigService } from 'src/config/config.service';
import { AuthResponse } from './interfaces/auth-response.interface';

@Injectable()
export class AcmaClient {
  private acmaAxios: AxiosInstance;

  constructor(private readonly config: ConfigService) {
    this.acmaAxios = axios.create({
      baseURL: this.config.get('ACMA_BASE_URL'),
    });
  }

  async authRequest(token: string): Promise<AuthResponse> {
    const axiosConfig: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await this.acmaAxios.post<AuthResponse>('/auth/verify', { token }, axiosConfig);
      return response.data;
    } catch (error) {
      if (error?.response?.status === HttpStatus.UNAUTHORIZED) {
        throw new UnauthorizedException(error.message);
      }
      if (error?.response?.status === HttpStatus.NOT_FOUND) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  async findUserById(id: string, token: string): Promise<any> {
    const axiosConfig: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await this.acmaAxios.post<AuthResponse>(`/user/${id}`, { token }, axiosConfig);
      return response.data;
    } catch (error) {
      if (error?.response?.status === HttpStatus.UNAUTHORIZED) {
        throw new UnauthorizedException(error.message);
      }
      if (error?.response?.status === HttpStatus.NOT_FOUND) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
