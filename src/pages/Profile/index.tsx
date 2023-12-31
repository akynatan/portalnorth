import React, { useCallback, useRef, ChangeEvent } from 'react';
import { FiMail, FiUser, FiLock, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory, Link } from 'react-router-dom';

import clientImg from '../../assets/user.png';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AvatarInput } from './styles';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const { addToast } = useToast();
  const history = useHistory();

  const { client, updateClient } = useAuth();

  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      formRef.current?.setErrors({});
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: val => !!val.length,
              then: Yup.string().required('Campo obrigatório'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), undefined], 'Confirmação incorreta'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? { old_password, password, password_confirmation }
            : {}),
        };

        const response = await api.put(`/profile/${client.id}`, formData);

        if (response.data) {
          updateClient(response.data);

          addToast({
            type: 'success',
            title: 'Perfil atualizado!',
            description:
              'Suas informações do perfil foram atualizadas com sucesso!',
          });
        }

        history.push('/');
      } catch (err: any) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }

        const message =
          err?.response?.data?.error ||
          'Ocorreu um erro ao atualizar  perfil, tente novamente.';

        addToast({
          type: 'error',
          title: 'Erro na atualização!',
          description: message,
        });
      }
    },
    [updateClient, client, addToast, history],
  );

  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const data = new FormData();

      const { files } = e.target;
      if (files) {
        data.append('avatar', files[0]);

        api.patch('/clients/avatar', data).then(response => {
          updateClient(response.data);

          addToast({
            type: 'success',
            title: 'Avatar atualizado!',
          });
        });
      }
    },
    [updateClient, addToast],
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <Form
          ref={formRef}
          initialData={{
            name: client.name,
            email: client.email,
          }}
          onSubmit={handleSubmit}
        >
          <AvatarInput>
            <img
              src={client.avatar_url ? client.avatar_url : clientImg}
              alt={client.name}
            />
            <label htmlFor="avatar">
              <FiCamera />
              <input id="avatar" type="file" onChange={handleAvatarChange} />
            </label>
          </AvatarInput>

          <h1>Meu perfil</h1>

          <Input name="name" icon={FiUser} placeholder="Nome" />
          <Input name="email" icon={FiMail} placeholder="E-mail" />

          <Input
            containerStyle={{ marginTop: 24 }}
            name="old_password"
            icon={FiLock}
            type="password"
            placeholder="Senha Atual"
          />
          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Nova Senha"
          />
          <Input
            name="password_confirmation"
            icon={FiLock}
            type="password"
            placeholder="Confirmar Senha"
          />
          <Button type="submit">Confirmar Mudanças</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
