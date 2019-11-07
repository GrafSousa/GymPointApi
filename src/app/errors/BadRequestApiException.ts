import { HttpApiException } from './HttpApiException';

class BadRequestApiException extends HttpApiException {
  code = 400;
}

export { BadRequestApiException };
