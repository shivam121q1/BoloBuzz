"use client"
import { useGetChannel } from '@/features/channel/api/use-get-channels';
import { useChannelId } from '@/hooks/use-channel-id'
import { Loader, TriangleAlert } from 'lucide-react';
import React from 'react'
import Header from './Header';
import ChatInput from './chat-input';

const ChannelIdPage = () => {
    const channelId = useChannelId();
    const {data:channel,isLoading:channelLoading} = useGetChannel({id:channelId})
  if(channelLoading){
    return (
        <div className='h-full flex-1 flex items-center justify-center'>
            <Loader className='animate-spin size-5 text-muted-foreground' />

        </div>
    )
  }
  if(!channel){
    return (
        <div className='h-full flex-1 flex flex-col gap-y-2 items-center justify-center'>
            <TriangleAlert className='size-5 text-muted-foreground' />
             <span className='text-sm text-black'>Channel Not Found</span>
        </div>
    )
  }
  return (
    <div className='flex flex-col h-full'>
      <Header channelName={channel.name}  />
      <div className='flex-1'/>
      <ChatInput placeholder={`Message #${channel.name}`} />
    </div>
  )
}

export default ChannelIdPage
