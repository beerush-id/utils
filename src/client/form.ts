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
const FORM_ACCESSORIES = [ 'label', '.placeholder', '.input-icon', '.input-unit', 'select', '[required]' ];

export function inputfield(self: HTMLElement, options?: InputFieldOptions): InputFieldInstance {
  let input: FormInputs;
  let validate = (value: string | number | boolean) => true;
  let interacted = false;

  const update = (newOptions?: InputFieldOptions) => {
    if (input) {
      input.removeEventListener('blur', blur);
      input.removeEventListener('focus', focus);
    }

    input = newOptions?.input || self.querySelector(FORM_INPUTS.join(', ')) as HTMLInputElement;

    FORM_ACCESSORIES.forEach((selector) => {
      const name = selector.replace(/[.[\]:]+/g, '');
      const child = self.querySelector(selector);

      if (child) {
        self.classList.add(`has-${ name }`);
      } else if (self.classList.contains(`has-${ name }`)) {
        self.classList.remove(`has-${ name }`);
      }
    });

    if (input) {
      input.addEventListener('blur', blur);
      input.addEventListener('focus', focus);

      if (typeof newOptions?.validate === 'function') {
        validate = newOptions.validate;
      }

      if (newOptions?.title) {
        input.title = newOptions.title;
      }

      blur();
    }
  };

  const blur = () => {
    interacted = true;

    self.classList.remove('has-focus');

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

  const focus = () => {
    self.classList.add('has-focus');
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
