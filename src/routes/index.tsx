import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import SignIn from '../pages/SignIn';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';

import Profile from '../pages/Profile';
import Invoices from '../pages/Invoices';
import FirstAcess from '../pages/FirstAcess';
import SetPassword from '../pages/SetPassword';
import Slips from '../pages/Slips';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/primeiro-acesso" component={FirstAcess} />
    <Route path="/criar-senha" component={SetPassword} />
    <Route path="/login" component={SignIn} />
    <Route path="/esqueci-minha-senha" component={ForgotPassword} />
    <Route path="/resetar-senha" component={ResetPassword} />

    <Route path="/" exact component={Invoices} isPrivate />
    <Route path="/notafiscal/:id/boletos" exact component={Slips} isPrivate />
    <Route path="/profile" component={Profile} isPrivate />
  </Switch>
);

export default Routes;
