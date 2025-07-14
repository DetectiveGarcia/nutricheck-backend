
export type Nutrient = {
    name: string;
    amount: string;
    unit: string
}

export type ChatGPTRequestBody = {
    productTitle: string;
    totalWeight: string;
    nutriInfoPerGram: string
    form: Nutrient[]
}