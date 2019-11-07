import { HttpApiException } from './HttpApiException';

class NotFoundApiException extends HttpApiException {
  code = 404;
}

export { NotFoundApiException };
