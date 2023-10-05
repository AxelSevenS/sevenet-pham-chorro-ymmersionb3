const TAG = Symbol()
export type integer = number & { readonly [TAG]: unique symbol }


export function parseInteger(value: string): integer {
    return parseInt(value) as integer
}

