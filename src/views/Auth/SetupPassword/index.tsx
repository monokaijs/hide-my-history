import {Button, Input, message, Typography} from "antd";
import styles from "./styles.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faKey} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import {generateKeyPairEncrypted} from "~utils/encryption.utils";
import {useAppDispatch, useAppSelector} from "~redux/store";
import {setAuthData} from "~redux/slices/auth.slice";
import {useNavigate} from "react-router";

export default function SetupPasswordPage() {
  const dispatch = useAppDispatch();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const {encryptedPrivateKey} = useAppSelector(state => state.auth);
  const navigate = useNavigate();

  const finish = async () => {
    setLoading(true);
    const keyPair = await generateKeyPairEncrypted(password);
    dispatch(setAuthData({
      encryptedPrivateKey: keyPair.privateKey,
      publicKey: keyPair.publicKey,
    }));
    message.success("Master password created. Login to access features now!");
    navigate('/auth/login');
    setLoading(false);
  }

  useEffect(() => {
    if (encryptedPrivateKey) navigate('/auth/login');
  }, [encryptedPrivateKey]);

  return <div className={styles.setupPassword}>
    <Typography.Title level={3} className={styles.title}>
      Hello
    </Typography.Title>
    <div className={styles.description}>
      You need to create a password to prevent unauthorized access and encrypt sensitive data.
    </div>
    <div className={styles.form}>
      <Input.Password
        value={password}
        onChange={e => setPassword(e.target.value)}
        prefix={<FontAwesomeIcon icon={faKey} style={{marginRight: 6}}/>}
        placeholder={'Password...'}
      />
    </div>
    <Button type={'primary'} block onClick={finish} loading={loading}>
      Create
    </Button>
  </div>
}