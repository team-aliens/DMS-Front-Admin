import { useMutation, useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { useRef } from 'react';
import { resetPassword } from '@/apis/managers';
import { ResetPasswordRequest } from '@/apis/managers/request';
import { useToast } from '@/hooks/useToast';
import { LoginRequest } from '@/apis/auth/request';
import {
  checkEmailAuthCode,
  checkEmailDuplicate,
  login,
  postEmailAuthCode,
} from '@/apis/auth';
import { setCookie } from '@/utils/cookies';
import { queryKeys } from '@/utils/queryKeys';
import { pagePath } from '@/utils/pagePath';
import { setUseableFeatures } from '@/utils/setUseableFeatures';

interface PropsType {
  resetPwdState: ResetPasswordRequest;
}

export const useResetPwdMutation = ({ resetPwdState }: PropsType) => {
  const { toastDispatch } = useToast();
  const navigate = useNavigate();

  return useMutation(() => resetPassword(resetPwdState), {
    onSuccess: () => {
      toastDispatch({
        actionType: 'APPEND_TOAST',
        toastType: 'SUCCESS',
        message: '비밀번호가 변경되었습니다.',
      });
      navigate(pagePath.home);
    },
  });
};

interface LoginPropsType {
  loginState: LoginRequest;
  autoSave: boolean;
  changeErrorMessage: (type: string, message: string) => void;
}

export const useLoginMutation = ({
  loginState,
  autoSave,
  changeErrorMessage,
}: LoginPropsType) => {
  const { toastDispatch } = useToast();
  const navigate = useNavigate();

  return useMutation(() => login(loginState), {
    onSuccess: (res) => {
      toastDispatch({
        actionType: 'APPEND_TOAST',
        toastType: 'SUCCESS',
        message: '로그인이 완료되었습니다.',
      });
      setUseableFeatures(res.features);
      const accessExpired = new Date(res.access_token_expired_at);
      setCookie('access_token', res.access_token, {
        expires: accessExpired,
      });

      if (autoSave) {
        const refreshExpired = new Date(res.refresh_token_expired_at);
        setCookie('refresh_token', res.refresh_token, {
          expires: refreshExpired,
        });
      }
      navigate(pagePath.home);
    },
    onError: (err: AxiosError) => {
      if (err.response.status === 404) {
        changeErrorMessage('account_id', '존재하지 않는 사용자입니다.');
      } else if (err.response.status === 401) {
        changeErrorMessage('password', '비밀번호가 일치하지 않습니다.');
      }
    },
    onSettled: () => {
      autoSave
        ? localStorage.setItem('account_id', loginState.account_id)
        : localStorage.removeItem('account_id');
    },
  });
};

interface PostEmailAuthCodePropsType {
  email: string;
}

export const usePostEmailAuthCodeMutation = ({
  email,
}: PostEmailAuthCodePropsType) => {
  const { toastDispatch } = useToast();

  const requestType = useRef<string>('');
  return useMutation(
    () =>
      postEmailAuthCode({
        email,
        type: 'PASSWORD',
      }),
    {
      onMutate: (type?: 'RESEND') => {
        if (type === 'RESEND') requestType.current = type;
      },
      onSuccess: () => {
        if (requestType.current === 'RESEND') {
          toastDispatch({
            actionType: 'APPEND_TOAST',
            toastType: 'INFORMATION',
            message: `${email}으로 인증코드가 재전송 되었습니다.`,
          });
        }
      },
    },
  );
};

export const useCheckEmailDuplicate = (accountId: string) => {
  const { toastDispatch } = useToast();
  return useQuery(
    [queryKeys.아이디존재여부확인, accountId],
    () => checkEmailDuplicate(accountId),
    {
      refetchOnWindowFocus: false,
      enabled: false,
      onError: () => {
        toastDispatch({
          actionType: 'APPEND_TOAST',
          message: '일치하는 아이디가 존재하지 않습니다.',
          toastType: 'ERROR',
        });
      },
    },
  );
};

interface CheckEmailAuthCodePropsType {
  email: string;
  authCode: string;
}

export const useCheckEmailAuthCode = ({
  email,
  authCode,
}: CheckEmailAuthCodePropsType) =>
  useQuery(
    [queryKeys.이메일인증코드확인, email, authCode],
    () => checkEmailAuthCode(email, authCode, 'PASSWORD'),
    {
      refetchOnWindowFocus: false,
      enabled: false,
    },
  );
