import { get, post, del, put } from '@/utils/request'

/**
 * 头像实体接口
 */
export interface Avatar {
    id: number
    name: string
    url: string
    is_active: boolean
    sort_order: number
    created_at: string
}

/**
 * 获取可用头像列表（用户使用）
 */
export const getActiveAvatars = async (): Promise<Avatar[]> => {
    const response = await get<any>('/v1/avatars/active')
    return response.data || response
}

/**
 * 获取全部头像列表（管理员）
 */
export const getAllAvatars = async (): Promise<Avatar[]> => {
    const response = await get<any>('/v1/avatars')
    return response.data || response
}

/**
 * 上传头像（管理员）
 */
export const uploadAvatar = async (file: File, name?: string): Promise<Avatar> => {
    const formData = new FormData()
    formData.append('file', file)
    if (name) formData.append('name', name)
    return await post('/v1/avatars/upload', formData)
}

/**
 * 更新头像信息（管理员）
 */
export const updateAvatarInfo = async (id: number, data: Partial<Avatar>): Promise<Avatar> => {
    return await put(`/v1/avatars/${id}`, data)
}

/**
 * 删除头像（管理员）
 */
export const deleteAvatar = async (id: number): Promise<void> => {
    return await del(`/v1/avatars/${id}`)
}

/**
 * 用户选择头像
 */
export const selectAvatar = async (avatarId: number): Promise<void> => {
    return await post('/v1/user/avatar', { avatar_id: avatarId })
}
