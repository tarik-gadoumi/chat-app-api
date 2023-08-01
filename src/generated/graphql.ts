import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  Timestamp: number,
  NEString: string,
};

export type DeviceMutation = {
   __typename?: 'DeviceMutation',
  register: Scalars['Boolean'],
  unregister: Scalars['Boolean'],
};


export type DeviceMutationRegisterArgs = {
  input: DeviceRegisterInput
};


export type DeviceMutationUnregisterArgs = {
  token: Scalars['NEString']
};

export enum DevicePlatform {
  IOS = 'IOS',
  ANDROID = 'ANDROID'
}

export type DeviceRegisterInput = {
  user_id: Scalars['NEString'],
  token: Scalars['NEString'],
  devicePlatform: DevicePlatform,
  deviceYear?: Maybe<Scalars['String']>,
  systemVersion?: Maybe<Scalars['String']>,
  deviceName?: Maybe<Scalars['String']>,
};

export type LoginInput = {
  name: Scalars['NEString'],
  password: Scalars['NEString'],
};

export type Message = {
   __typename?: 'Message',
  _id: Scalars['ID'],
  sender_id: Scalars['String'],
  senderName: Scalars['String'],
  text: Scalars['String'],
  date: Scalars['Timestamp'],
  roomId: Scalars['ID'],
};

export type MessageSendInput = {
  sender_id: Scalars['NEString'],
  senderName: Scalars['NEString'],
  text: Scalars['NEString'],
  roomId: Scalars['ID'],
};

export type MessagesMutation = {
   __typename?: 'MessagesMutation',
  send: Message,
};


export type MessagesMutationSendArgs = {
  input: MessageSendInput
};

export type Mutation = {
   __typename?: 'Mutation',
  messages: MessagesMutation,
  device: DeviceMutation,
  user: UserMutation,
  room: RoomMutation,
};


export type Query = {
   __typename?: 'Query',
  messages: Array<Message>,
  users: Array<User>,
  rooms: Array<Room>,
  room?: Maybe<Room>,
};


export type QueryMessagesArgs = {
  offset?: Scalars['Int'],
  limit?: Scalars['Int']
};


export type QueryRoomsArgs = {
  offset: Scalars['Int'],
  limit: Scalars['Int']
};


export type QueryRoomArgs = {
  id: Scalars['ID']
};

export type Room = {
   __typename?: 'Room',
  _id: Scalars['ID'],
  name: Scalars['String'],
  users: Array<User>,
  messages: Array<Message>,
  creator?: Maybe<RoomCreator>,
};


export type RoomMessagesArgs = {
  offset?: Scalars['Int'],
  limit?: Scalars['Int']
};

export type RoomCreateInput = {
  name: Scalars['String'],
  userIds: Array<Scalars['ID']>,
  creator?: Maybe<RoomCreatorInput>,
};

export type RoomCreator = {
   __typename?: 'RoomCreator',
  _id: Scalars['ID'],
  name: Scalars['String'],
};

export type RoomCreatorInput = {
  _id: Scalars['ID'],
  name: Scalars['String'],
};

export type RoomMutation = {
   __typename?: 'RoomMutation',
  create: Room,
  delete: Scalars['ID'],
  sendMessage: Message,
};


export type RoomMutationCreateArgs = {
  input: RoomCreateInput
};


export type RoomMutationDeleteArgs = {
  id: Scalars['ID']
};


export type RoomMutationSendMessageArgs = {
  input: MessageSendInput,
  roomId: Scalars['ID']
};

export type SignupInput = {
  name: Scalars['NEString'],
  password: Scalars['NEString'],
};

export enum Status {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE'
}

export type Subscription = {
   __typename?: 'Subscription',
  message: Message,
  newMessage?: Maybe<Message>,
  roomUpdated?: Maybe<Room>,
  roomDeleted: Scalars['ID'],
};


export type SubscriptionNewMessageArgs = {
  roomId: Scalars['ID']
};


export type User = {
   __typename?: 'User',
  _id: Scalars['ID'],
  name: Scalars['NEString'],
  token: Scalars['String'],
  status: Status,
};

export type UserMutation = {
   __typename?: 'UserMutation',
  signup: User,
  login: User,
  logout: Scalars['Boolean'],
};


export type UserMutationSignupArgs = {
  input: SignupInput
};


export type UserMutationLoginArgs = {
  input: LoginInput
};


export type UserMutationLogoutArgs = {
  name: Scalars['NEString'],
  token: Scalars['String']
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Query: ResolverTypeWrapper<{}>,
  Int: ResolverTypeWrapper<Scalars['Int']>,
  Message: ResolverTypeWrapper<Message>,
  ID: ResolverTypeWrapper<Scalars['ID']>,
  String: ResolverTypeWrapper<Scalars['String']>,
  Timestamp: ResolverTypeWrapper<Scalars['Timestamp']>,
  User: ResolverTypeWrapper<User>,
  NEString: ResolverTypeWrapper<Scalars['NEString']>,
  Status: Status,
  Room: ResolverTypeWrapper<Room>,
  RoomCreator: ResolverTypeWrapper<RoomCreator>,
  Mutation: ResolverTypeWrapper<{}>,
  MessagesMutation: ResolverTypeWrapper<MessagesMutation>,
  MessageSendInput: MessageSendInput,
  DeviceMutation: ResolverTypeWrapper<DeviceMutation>,
  DeviceRegisterInput: DeviceRegisterInput,
  DevicePlatform: DevicePlatform,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  UserMutation: ResolverTypeWrapper<UserMutation>,
  SignupInput: SignupInput,
  LoginInput: LoginInput,
  RoomMutation: ResolverTypeWrapper<RoomMutation>,
  RoomCreateInput: RoomCreateInput,
  RoomCreatorInput: RoomCreatorInput,
  Subscription: ResolverTypeWrapper<{}>,
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {},
  Int: Scalars['Int'],
  Message: Message,
  ID: Scalars['ID'],
  String: Scalars['String'],
  Timestamp: Scalars['Timestamp'],
  User: User,
  NEString: Scalars['NEString'],
  Status: Status,
  Room: Room,
  RoomCreator: RoomCreator,
  Mutation: {},
  MessagesMutation: MessagesMutation,
  MessageSendInput: MessageSendInput,
  DeviceMutation: DeviceMutation,
  DeviceRegisterInput: DeviceRegisterInput,
  DevicePlatform: DevicePlatform,
  Boolean: Scalars['Boolean'],
  UserMutation: UserMutation,
  SignupInput: SignupInput,
  LoginInput: LoginInput,
  RoomMutation: RoomMutation,
  RoomCreateInput: RoomCreateInput,
  RoomCreatorInput: RoomCreatorInput,
  Subscription: {},
}>;

export type DeviceMutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeviceMutation'] = ResolversParentTypes['DeviceMutation']> = ResolversObject<{
  register?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<DeviceMutationRegisterArgs, 'input'>>,
  unregister?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<DeviceMutationUnregisterArgs, 'token'>>,
}>;

export type MessageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Message'] = ResolversParentTypes['Message']> = ResolversObject<{
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  sender_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  senderName?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  date?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>,
  roomId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
}>;

export type MessagesMutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['MessagesMutation'] = ResolversParentTypes['MessagesMutation']> = ResolversObject<{
  send?: Resolver<ResolversTypes['Message'], ParentType, ContextType, RequireFields<MessagesMutationSendArgs, 'input'>>,
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  messages?: Resolver<ResolversTypes['MessagesMutation'], ParentType, ContextType>,
  device?: Resolver<ResolversTypes['DeviceMutation'], ParentType, ContextType>,
  user?: Resolver<ResolversTypes['UserMutation'], ParentType, ContextType>,
  room?: Resolver<ResolversTypes['RoomMutation'], ParentType, ContextType>,
}>;

export interface NeStringScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['NEString'], any> {
  name: 'NEString'
}

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  messages?: Resolver<Array<ResolversTypes['Message']>, ParentType, ContextType, RequireFields<QueryMessagesArgs, 'offset' | 'limit'>>,
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>,
  rooms?: Resolver<Array<ResolversTypes['Room']>, ParentType, ContextType, RequireFields<QueryRoomsArgs, 'offset' | 'limit'>>,
  room?: Resolver<Maybe<ResolversTypes['Room']>, ParentType, ContextType, RequireFields<QueryRoomArgs, 'id'>>,
}>;

export type RoomResolvers<ContextType = any, ParentType extends ResolversParentTypes['Room'] = ResolversParentTypes['Room']> = ResolversObject<{
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>,
  messages?: Resolver<Array<ResolversTypes['Message']>, ParentType, ContextType, RequireFields<RoomMessagesArgs, 'offset' | 'limit'>>,
  creator?: Resolver<Maybe<ResolversTypes['RoomCreator']>, ParentType, ContextType>,
}>;

export type RoomCreatorResolvers<ContextType = any, ParentType extends ResolversParentTypes['RoomCreator'] = ResolversParentTypes['RoomCreator']> = ResolversObject<{
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
}>;

export type RoomMutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['RoomMutation'] = ResolversParentTypes['RoomMutation']> = ResolversObject<{
  create?: Resolver<ResolversTypes['Room'], ParentType, ContextType, RequireFields<RoomMutationCreateArgs, 'input'>>,
  delete?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<RoomMutationDeleteArgs, 'id'>>,
  sendMessage?: Resolver<ResolversTypes['Message'], ParentType, ContextType, RequireFields<RoomMutationSendMessageArgs, 'input' | 'roomId'>>,
}>;

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  message?: SubscriptionResolver<ResolversTypes['Message'], "message", ParentType, ContextType>,
  newMessage?: SubscriptionResolver<Maybe<ResolversTypes['Message']>, "newMessage", ParentType, ContextType, RequireFields<SubscriptionNewMessageArgs, 'roomId'>>,
  roomUpdated?: SubscriptionResolver<Maybe<ResolversTypes['Room']>, "roomUpdated", ParentType, ContextType>,
  roomDeleted?: SubscriptionResolver<ResolversTypes['ID'], "roomDeleted", ParentType, ContextType>,
}>;

export interface TimestampScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Timestamp'], any> {
  name: 'Timestamp'
}

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['NEString'], ParentType, ContextType>,
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>,
}>;

export type UserMutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserMutation'] = ResolversParentTypes['UserMutation']> = ResolversObject<{
  signup?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<UserMutationSignupArgs, 'input'>>,
  login?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<UserMutationLoginArgs, 'input'>>,
  logout?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<UserMutationLogoutArgs, 'name' | 'token'>>,
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  DeviceMutation?: DeviceMutationResolvers<ContextType>,
  Message?: MessageResolvers<ContextType>,
  MessagesMutation?: MessagesMutationResolvers<ContextType>,
  Mutation?: MutationResolvers<ContextType>,
  NEString?: GraphQLScalarType,
  Query?: QueryResolvers<ContextType>,
  Room?: RoomResolvers<ContextType>,
  RoomCreator?: RoomCreatorResolvers<ContextType>,
  RoomMutation?: RoomMutationResolvers<ContextType>,
  Subscription?: SubscriptionResolvers<ContextType>,
  Timestamp?: GraphQLScalarType,
  User?: UserResolvers<ContextType>,
  UserMutation?: UserMutationResolvers<ContextType>,
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
