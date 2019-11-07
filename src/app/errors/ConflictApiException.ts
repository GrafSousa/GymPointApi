import { HttpApiException } from './HttpApiException';

class ConflictApiException extends HttpApiException {
  code = 409;
}

export { ConflictApiException };
