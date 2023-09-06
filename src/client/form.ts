export type FormInputs = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export type InputFieldOptions = {
  validate?: (value: string | number | boolean) => boolean;
  input?: FormInputs;
  title?: string;
};

export type InputFieldInstance = {
  update: (newInput: InputFieldOptions) => void;
  destroy: () => void;
};

const FORM_INPUTS = [ 'input', 'textarea', 'select' ];

export function inputfield(self: HTMLElement, options?: InputFieldOptions): InputFieldInstance {
  let input: FormInputs;
  let validate = (value: string | number | boolean) => true;
  let interacted = false;

  const update = (newOptions?: InputFieldOptions) => {
    if (input) {
      input.removeEventListener('blur', blur);
    }

    input = newOptions?.input || self.querySelector(FORM_INPUTS.join(', ')) as HTMLInputElement;

    if (input) {
      input.addEventListener('blur', blur);

      if (typeof newOptions?.validate === 'function') {
        validate = newOptions.validate;
      }

      if (newOptions?.title) {
        input.title = newOptions.title;
      }
    }
  };

  const blur = () => {
    interacted = true;

    if (input?.value) {
      self.classList.add('has-value');

      if (!input.required || typeof validate !== 'function') {
        self.classList.add('valid');
        self.classList.remove('invalid');
        return;
      }

      if (validate(input.value)) {
        self.classList.add('valid');
        self.classList.remove('invalid');
      } else {
        self.classList.remove('valid');
        self.classList.add('invalid');
      }
    } else if (interacted) {
      if (input.required) {
        self.classList.add('invalid');
      }

      self.classList.remove('has-value');
      self.classList.remove('valid');
    }
  };

  update(options);

  return {
    update,
    destroy: () => {
      if (input) {
        input.removeEventListener('blur', blur);
      }
    },
  };
}
