import { useEffect } from 'react';
import {
  useWatch,
  type DefaultValues,
  type FieldValues,
  type UseFormReturn,
} from 'react-hook-form';

/**
 * Keeps a resume section form and the builder in step: the form resets when the builder
 * sends new data, and a valid edit is passed up once typing pauses for `delayMs`.
 *
 * isDirty and isValid are read during render, which is what subscribes to them
 * (https://react-hook-form.com/docs/useform/formstate), and the watched values are a
 * dependency, so every edit restarts the pause.
 *
 * TValues is the form's field values (the schema's input), TData what the builder holds
 * (its output); a valid form's values are that data.
 */
export function useFormSync<TValues extends FieldValues, TData>(
  form: UseFormReturn<TValues, unknown, TData>,
  initialData: TData | undefined,
  onSubmit: (data: TData) => void,
  delayMs = 300
): void {
  useEffect(() => {
    if (initialData) form.reset(initialData as DefaultValues<TValues>);
  }, [initialData, form]);

  const values = useWatch({ control: form.control });
  const { isDirty, isValid } = form.formState;

  useEffect(() => {
    if (!isDirty || !isValid) return;
    const timeoutId = setTimeout(() => onSubmit(values as TData), delayMs);
    return () => clearTimeout(timeoutId);
  }, [values, isDirty, isValid, onSubmit, delayMs]);
}
