import { useMutation, useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import {
  deleteNotice,
  getNoticeDetail,
  getNoticeList,
  NoticeSortType,
  patchNotice,
  writeNotice,
} from '@/apis/notice';
import { useToast } from '@/hooks/useToast';
import { WriteNoticeRequest } from '@/apis/notice/request';
import { pagePath } from '@/utils/pagePath';
import { useModal } from './useModal';

export const useNoticeList = (sortType: NoticeSortType) =>
  useQuery(['getNoticeList', sortType], () => getNoticeList(sortType), {
    refetchOnWindowFocus: true,
  });

export const useDeleteNotice = (noticeId: string) => {
  const { closeModal } = useModal();
  const navigate = useNavigate();
  const { toastDispatch } = useToast();
  return useMutation(() => deleteNotice(noticeId), {
    onSuccess: () => {
      navigate(pagePath.notice.list);
      toastDispatch({
        actionType: 'APPEND_TOAST',
        message: '공지사항이 삭제되었습니다.',
        toastType: 'SUCCESS',
      });
      closeModal();
    },
  });
};

export const useNoticeDetail = (noticeId: string) =>
  useQuery(['noticeDetail', noticeId], () => getNoticeDetail(noticeId));

export const useWriteNotice = (content: WriteNoticeRequest) => {
  const { toastDispatch } = useToast();
  const navigate = useNavigate();

  return useMutation(() => writeNotice(content), {
    onSuccess: (res) => {
      toastDispatch({
        actionType: 'APPEND_TOAST',
        toastType: 'SUCCESS',
        message: '공지사항이 게시되었습니다.',
      });
      navigate(pagePath.notice.detail(res.data.notice_id));
    },
  });
};

export const usePatchNotice = (
  content: WriteNoticeRequest,
  noticeId: string,
) => {
  const { toastDispatch } = useToast();
  const navigate = useNavigate();

  return useMutation(() => patchNotice(content, noticeId), {
    onSuccess: (res) => {
      toastDispatch({
        actionType: 'APPEND_TOAST',
        toastType: 'SUCCESS',
        message: '공지사항이 수정되었습니다.',
      });
      navigate(pagePath.notice.detail(res.data.notice_id));
    },
  });
};
