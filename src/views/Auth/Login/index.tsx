import {Button, Form, Input, message, Typography} from "antd";
import styles from "./styles.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight, faKey} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import {useAppDispatch, useAppSelector} from "~redux/store";
import {decryptWithPassword} from "~utils/encryption.utils";
import {setAuthData} from "~redux/slices/auth.slice";
import {useNavigate} from "react-router";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const {encryptedPrivateKey} = useAppSelector(state => state.auth);
  const navigate = useNavigate();

  const finish = async (values: any) => {
    try {
      const privateKey = await decryptWithPassword(encryptedPrivateKey, values.password);
      dispatch(setAuthData({
        loggedIn: true,
        privateKey,
      }));
      message.success("Signed in");
      navigate('/');
    } catch (e) {
      console.log('error', e);
      message.error("Invalid password, please try again");
    }
  }

  return <div className={styles.loginPage}>
    <Typography.Title level={3} className={styles.title}>
      Login
    </Typography.Title>
    <Form onFinish={finish}>
      <div className={styles.description}>
        Enter password to manage your data.
      </div>
      <Form.Item name={"password"}>
        <Input.Password
          prefix={<FontAwesomeIcon icon={faKey} style={{marginRight: 6}}/>}
          placeholder={'Password...'}
        />
      </Form.Item>
      <Button htmlType={'submit'} type={'primary'} block>
        Continue <FontAwesomeIcon icon={faArrowRight} style={{marginLeft: 8}}/>
      </Button>
    </Form>
  </div>
}
