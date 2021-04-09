import React from "react";
import FormRenderer from "@data-driven-forms/react-form-renderer/form-renderer";
import componentTypes from "@data-driven-forms/react-form-renderer/component-types";
import FormTemplate from "@data-driven-forms/pf4-component-mapper/form-template";
import TextField from "@data-driven-forms/pf4-component-mapper/text-field";

export const FormMapper = ({ schema }: { schema: any }) => {
  const componentMapper = {
    [componentTypes.TEXT_FIELD]: (props: any) => (
      <TextField {...props} />
    ),
    description: ({
      component,
      name,
      label,
      text,
      ...props
    }: any) => {
      return (
        <h3 id={name} {...props}>
          {text}
        </h3>
      );
    },
  };
  return (
    <FormRenderer
      FormTemplate={(props) => (
        <FormTemplate {...props} showFormControls={false} />
      )}
      componentMapper={componentMapper}
      // @ts-ignore
      schema={schema}
      onSubmit={console.log}
    />
  );
}