import { z } from 'zod'
import { Currencies } from '../lib/currencies'
import { error } from 'console';

export const UpdateUserCurrencySchema = z.object({
    currency: z.custom(value => {
        const found = Currencies.some(c => c.value === value);
        if (!found) {
            throw new Error(`Tipo de moneda inválida: ${value}`)
        }

        return value;
    })
})