import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight, faEye, faKey, faLock} from "@fortawesome/free-solid-svg-icons";
import {useAppDispatch, useAppSelector} from "~redux/store";
import {decryptWithPassword} from "~utils/encryption.utils";
import {setAuthData} from "~redux/slices/auth.slice";
import {useNavigate} from "react-router";
import {PasswordInput} from "~components/shared/Input";
import {useState} from "react";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const [password, setPassword] = useState('');
  const {encryptedPrivateKey} = useAppSelector(state => state.auth);
  const navigate = useNavigate();

  const finish = async (e) => {
    e.preventDefault();
    try {
      const privateKey = await decryptWithPassword(encryptedPrivateKey, password);
      dispatch(setAuthData({
        loggedIn: true,
        privateKey,
      }));
      navigate('/');
    } catch (e) {
      console.log('error', e);
    }
  }

  return <div className={'login'}>
    <form onSubmit={finish} className={'login-form'}>
      <div className={'title'}>
        Login
      </div>
      <div className={'description'}>
        Enter password to manage your data.
      </div>
      <PasswordInput
        value={password}
        onValueChange={value => setPassword(value)}
        passwordToggle={true}
        leftIcon={faLock}
        placeholder={'Password...'}
      />
      <button typeof={'submit'} className={'btn-submit'}>
        Continue <FontAwesomeIcon icon={faArrowRight} style={{marginLeft: 8}}/>
      </button>
    </form>
    <div className={'credit'}>
      Written by <a href={'https://delimister.com'} target={'_blank'}>@MonokaiJs</a>
    </div>
  </div>
}
