import AppBaseModel from '#models/app_base_model';
import Collection from '#models/collection';
import User from '#models/user';
import { belongsTo, column } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';

export default class Link extends AppBaseModel {
  @column()
  declare name: string;

  @column()
  declare description: string;

  @column()
  declare url: string;

  @column()
  declare favorite: boolean;

  @column()
  declare collectionId: string;

  @belongsTo(() => Collection, { foreignKey: 'collectionId' })
  declare collection: BelongsTo<typeof Collection>;

  @column()
  declare authorId: string;

  @belongsTo(() => User, { foreignKey: 'authorId' })
  declare author: BelongsTo<typeof User>;
}
