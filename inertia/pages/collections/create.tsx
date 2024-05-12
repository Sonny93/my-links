import { useForm } from '@inertiajs/react';
import { ChangeEvent, FormEvent, useMemo } from 'react';
import FormField from '~/components/common/form/_form_field';
import TextBox from '~/components/common/form/textbox';
import BackToDashboard from '~/components/common/navigation/back_to_dashboard';
import FormLayout from '~/components/layouts/form_layout';
import { Visibility } from '../../../app/enums/visibility';

export default function CreateCollectionPage({
  disableHomeLink,
}: {
  disableHomeLink: boolean;
}) {
  const { data, setData, post, processing } = useForm({
    name: '',
    description: '',
    visibility: Visibility.PRIVATE,
  });
  const isFormDisabled = useMemo(
    () => processing || data.name.length === 0,
    [processing, data]
  );

  function handleOnCheck({ target }: ChangeEvent<HTMLInputElement>) {
    setData(
      'visibility',
      target.checked ? Visibility.PUBLIC : Visibility.PRIVATE
    );
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    post('/collections');
  }

  return (
    <FormLayout
      title="Create a collection"
      handleSubmit={handleSubmit}
      canSubmit={!isFormDisabled}
      disableHomeLink={disableHomeLink}
    >
      <BackToDashboard>
        <TextBox
          label="Collection name"
          placeholder="Collection name"
          name="name"
          onChange={setData}
          value={data.name}
          required
          autoFocus
        />
        <TextBox
          label="Collection description"
          placeholder="Collection description"
          name="description"
          onChange={setData}
          value={data.name}
        />
        <FormField>
          <label htmlFor="visibility">Public</label>
          <input
            type="checkbox"
            onChange={handleOnCheck}
            value={data.visibility}
            id="visibility"
          />
        </FormField>
      </BackToDashboard>
    </FormLayout>
  );
}
