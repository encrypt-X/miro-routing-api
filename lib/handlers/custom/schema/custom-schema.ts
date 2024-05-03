import BaseJoi from '@hapi/joi'
import { SUPPORTED_CHAINS } from '../../injector-sor'

const Joi = BaseJoi.extend((joi) => ({
  base: joi.array(),
  type: 'stringArray',
  messages: {
    'stringArray.type': '{{#label}} is not a valid string array',
  },
  coerce: (value, helpers) => {
    if (typeof value !== 'string') {
      return { value: value, errors: [helpers.error('stringArray.type')] }
    }
    value = value.replace(/^\[|\]$/g, '').split(',')
    const ar = (value as string[]).map((val) => {
      return val.trim()
    })
    return { value: ar }
  },
}))

export const CustomRequestBodySchemeJoi = Joi.object({
  hello: Joi.string().optional(),
})

export type CustomRequestBody = {
  hello?: string
}

export const CustomResponseSchemeJoi = Joi.object().keys({
  world: Joi.string().required(),
})

export type CustomResponse = {
  world: string;
}

export const CustomQueryParamsJoi = Joi.object({
  chainId: Joi.number()
    .valid(...SUPPORTED_CHAINS.values())
    .required(),
})

export type CustomQueryParams = {
  chainId: number
}
