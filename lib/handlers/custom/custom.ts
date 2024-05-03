import Joi from '@hapi/joi'
import { APIGLambdaHandler, ErrorResponse, HandleRequestParams, Response } from '../handler'
import { ContainerInjected, RequestInjected } from '../injector-sor'
import {
  CustomQueryParams,
  CustomQueryParamsJoi,
  CustomRequestBody,
  CustomRequestBodySchemeJoi,
  CustomResponse,
  CustomResponseSchemeJoi
} from './schema/custom-schema'

export class CustomHandler extends APIGLambdaHandler<
  ContainerInjected,
  RequestInjected<null>,
  CustomRequestBody,
  CustomQueryParams,
  CustomResponse
> {
  public async handleRequest(
    params: HandleRequestParams<ContainerInjected, RequestInjected<null>, CustomRequestBody, CustomQueryParams>
  ): Promise<Response<CustomResponse> | ErrorResponse> {
    // const { chainId, metric, log, quoteSpeed, intent } = params.requestInjected
    // let result: Response<QuoteResponse> | ErrorResponse
    params.requestInjected.log.info({ query: params.requestQueryParams, body: params.requestBody });

    return {
      statusCode: 400,
      errorCode: 'NOT_IMPLEMENTED',
      detail: `NOT IMPLEMENTED YET`,
    }
  }

  protected requestBodySchema(): Joi.ObjectSchema | null {
    return CustomRequestBodySchemeJoi
  }

  protected requestQueryParamsSchema(): Joi.ObjectSchema | null {
    return CustomQueryParamsJoi
  }

  protected responseBodySchema(): Joi.ObjectSchema | null {
    return CustomResponseSchemeJoi
  }
}
