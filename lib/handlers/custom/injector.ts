import {
  ID_TO_CHAIN_ID,
  setGlobalLogger,
  setGlobalMetric,
} from '@uniswap/smart-order-router'
import { MetricsLogger } from 'aws-embedded-metrics'
import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import { default as bunyan, default as Logger } from 'bunyan'
import { ContainerInjected, InjectorSOR, RequestInjected } from '../injector-sor'
import { AWSMetricsLogger } from '../router-entities/aws-metrics-logger'
import { CustomRequestBody, CustomQueryParams } from './schema/custom-schema'

export class CustomHandlerInjector extends InjectorSOR<
  null,
  CustomQueryParams,
  CustomRequestBody
> {
  public async getRequestInjected(
    containerInjected: ContainerInjected,
    _requestBody: CustomRequestBody,
    requestQueryParams: CustomQueryParams,
    _event: APIGatewayProxyEvent,
    context: Context,
    log: Logger,
    metricsLogger: MetricsLogger
  ): Promise<RequestInjected<null>> {
    const requestId = context.awsRequestId
    const logLevel = bunyan.INFO
    const { chainId } = requestQueryParams

    log = log.child({
      serializers: bunyan.stdSerializers,
      level: logLevel,
      requestId,
      chainId,
    })
    setGlobalLogger(log)

    metricsLogger.setNamespace('Uniswap')
    metricsLogger.setDimensions({ Service: 'RoutingAPI' })
    const metric = new AWSMetricsLogger(metricsLogger)
    setGlobalMetric(metric)

    // Today API is restricted such that both tokens must be on the same chain.
    const chainIdEnum = ID_TO_CHAIN_ID(chainId)

    const { dependencies } = containerInjected

    if (!dependencies[chainIdEnum]) {
      // Request validation should prevent reject unsupported chains with 4xx already, so this should not be possible.
      throw new Error(`No container injected dependencies for chain: ${chainIdEnum}`)
    }

    const {
      // provider,
      v3PoolProvider,
      // multicallProvider,
      tokenProvider,
      tokenListProvider,
      // v3SubgraphProvider,
      // blockedTokenListProvider,
      v2PoolProvider,
      // tokenValidatorProvider,
      // tokenPropertiesProvider,
      // v2QuoteProvider,
      // v2SubgraphProvider,
      // gasPriceProvider: gasPriceProviderOnChain,
      // simulator,
      // routeCachingProvider,
    } = dependencies[chainIdEnum]!

    return {
      chainId: chainIdEnum,
      id: requestId,
      router: null,
      log,
      metric,
      v3PoolProvider,
      v2PoolProvider,
      tokenProvider,
      tokenListProvider,
    }
  }
}
