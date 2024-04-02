import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash, faKey, IconDefinition} from "@fortawesome/free-solid-svg-icons";
import {HTMLAttributes, HTMLInputTypeAttribute, ReactNode, useEffect, useState} from "react";
import {cn} from "~utils";

interface InputProps {
  name?: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  className?: HTMLAttributes<HTMLInputElement>['className'];
  value?: string;
  onValueChange?: (text: string) => any;
  leftIcon?: IconDefinition;
  affix?: ReactNode;
}

interface PasswordInputProps extends InputProps {
  passwordToggle?: boolean;
}

export default function Input(props: InputProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  return <div className={cn('input-wrapper', props.className)}>
    {props.leftIcon && (
      <FontAwesomeIcon icon={props.leftIcon} className={'icon'}/>
    )}
    <input
      value={value}
      onChange={e => {
        setValue(e.target.value);
        if (props.onValueChange) props.onValueChange(e.target.value);
      }}
      type={props.type}
      name={props.name}
      placeholder={props.placeholder}
    />
    {props.affix}
  </div>
}

export function PasswordInput(props: PasswordInputProps) {
  const [revealPassword, setPasswordRevealed] = useState(false);
  return <Input
    {...props}
    type={revealPassword ? 'text' : 'password'}
    affix={props.passwordToggle && <div onClick={() => {
      setPasswordRevealed(!revealPassword);
    }} className={'btn-util'}>
      <FontAwesomeIcon icon={revealPassword ? faEyeSlash : faEye}/>
    </div>}
  />
}