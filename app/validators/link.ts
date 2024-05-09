import vine from '@vinejs/vine';

export const linkValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(254),
    description: vine.string().trim().maxLength(300).optional(),
    url: vine.string().trim(),
    favorite: vine.boolean(),
    collectionId: vine.string().trim(),
  })
);
