export const HttpConstants = {
  Headers: {
    ContentTypeJson: {
      'Content-Type': 'application/json',
    },
    AcceptJson: {
      Accept: 'application/json',
    },
  },
  Methods: {
    Get: 'GET',
    Post: 'POST',
    Delete: 'DELETE'
  },
  StatusCodes: {
    Ok: 200,
    BadRequest: 400,
    Unauthorized: 401,
    Forbidden: 403,
    NotFound: 404,
    Conflict: 409,
  },
};