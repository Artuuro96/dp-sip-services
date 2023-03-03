import { createMock } from '@golevelup/ts-jest';
import { GlobalExceptionFilter } from './global-exception.filter';

describe('GlobalExceptionFilter', () => {
  const mockException = createMock<Error>({
    message: 'Sample Exception',
    stack: 'Sample Stack Exception',
  });
  const mockJson = jest.fn();
  const mockStatus = jest.fn().mockImplementation(() => ({
    json: mockJson,
  }));
  const mockGetResponse = jest.fn().mockImplementation(() => ({
    status: mockStatus,
  }));
  const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
    getResponse: mockGetResponse,
    getRequest: jest.fn(),
  }));

  const mockArgumentsHost = {
    switchToHttp: mockHttpArgumentsHost,
    getArgByIndex: jest.fn(),
    getArgs: jest.fn(),
    getType: jest.fn(),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
  };

  describe('catch', () => {
    it('should call catch method', () => {
      const globalExceptionFilter = new GlobalExceptionFilter();
      globalExceptionFilter.catch(mockException, mockArgumentsHost);
      expect(mockHttpArgumentsHost).toBeCalledTimes(1);
      expect(mockHttpArgumentsHost).toBeCalledWith();
      expect(mockGetResponse).toBeCalledTimes(1);
      expect(mockGetResponse).toBeCalledWith();
      expect(mockStatus).toBeCalledTimes(1);
      expect(mockJson).toBeCalledTimes(1);
      expect(mockJson).toBeCalledWith({
        message: 'Sample Exception',
        statusCode: 500,
        error: 'Sample Stack Exception',
      }); //expect(response).toBeDefined();
    });
  });
});
