import React, { useRef, useCallback, useState } from 'react';
import { FiArrowLeft, FiUser } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.png';

import InputCPF from '../../components/InputCPF';
import Button from '../../components/Button';

import { Container, Content, AnimationContainer } from './styles';
import api from '../../services/api';

interface ForgotPasswordFormData {
  document: string;
}

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      setLoading(true);
      formRef.current?.setErrors({});

      try {
        const schema = Yup.object().shape({
          document: Yup.string().required('Documento obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { document } = data;

        api
          .post('/password/forgot', {
            document: document.replace(/[^\w\s]/gi, ''),
          })
          .then(() => {
            addToast({
              type: 'success',
              title: 'E-mail de recuperação enviado',
              description:
                'Enviamos um e-mail para confirmar a recuperação de senha. Cheque sua caixa de mensagem.',
            });

            setTimeout(() => {
              history.push('/login');
            }, 2500);
          })
          .catch(err => {
            const description = err?.response?.data?.error || '';
            addToast({
              type: 'error',
              title: 'Erro ao enviar email de recuperação de senha',
              description,
            });
          });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na recuperação de senha',
          description:
            'Ocorreu um erro ao tentar realizar a recuperação de senha, tente novamente.',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast, history],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="PortalNorth" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperar senha</h1>
            <InputCPF name="document" icon={FiUser} placeholder="Documento" />

            <Button loading={loading} type="submit">
              Recuperar
            </Button>
          </Form>
          <Link to="/">
            <FiArrowLeft />
            Voltar ao login
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default ForgotPassword;
