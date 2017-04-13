export interface AssistantContext {
  name: string;
  lifespan?: number;
  parameters?: object;
}

export interface AssistantFollowupEvent {
  name: string;
  data?: object;
}

export interface AssistantResponse {
  speech: string;
  displayText: string;
  data?: object;
  contextOut?: AssistantContext;
  source?: string;
  followupEvent?: AssistantFollowupEvent
}

export interface AssistantParameters {
  'given-name': string;
  'last-name': string;
  'email'?: string;
  'phone-number'?: string;
  'address'?: string;
  'confirmation'?: string;
  'field'?: string;
}

export interface AssistantResult {
  source: string;
  action: string;
  parameters: AssistantParameters;
  contexts: object[];
  metadata: object;
  fulfillment: object;
  status: object;
}

export interface AssistantRequest {
  id: string;
  lang: string;
  result: AssistantResult;
}
