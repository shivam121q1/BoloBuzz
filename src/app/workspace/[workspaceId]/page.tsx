"use client"

import { useGetChannels } from "@/features/channel/api/use-get-Channel";
import { useCreateChannelModal } from "@/features/channel/store/use-create-channel-modal";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useworkspaceId } from "@/hooks/use-workspace-id";
import { Loader, TriangleAlert } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { useEffect, useMemo } from "react";


const WorkspaceIdPage = ()=>{
const router = useRouter();
   const workspaceId = useworkspaceId(); 
   const[open,setOpen] = useCreateChannelModal();

   const {data:workspace,isLoading:workspaceLoading} = useGetWorkspace({id:workspaceId}); 
   const {data:channels,isLoading:channelsLoading} = useGetChannels({workspaceId});

   const channelId = useMemo(()=>channels?.[0]?._id,[channels]);
   useEffect(()=>{
     if(workspaceLoading || channelsLoading || !workspace) return ;

     if(channelId){
        router.push(`/workspace/${workspaceId}/channel/${channelId}`);
     }else if(!open){
        setOpen(true);
     }
   },[channelId,workspaceLoading,channelsLoading,workspace,open,setOpen,router,workspaceId])
  if(workspaceLoading || channelsLoading){
    return(
        <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
          <Loader className=" size-6 animate-spin text-muted-foreground"/>
        </div>
    )
  }

  if(!workspace){
    return(
        <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
          <TriangleAlert className=" size-6 animate-spin text-muted-foreground"/>
          <span className="text-sm text-muted-foreground-">Workspace Not found</span>
        </div>
    )
  }
   
    return(
        <div className="h-full bg-blue-400">
            {/* Data :{JSON.stringify(data)} */}
        Hello    
        </div>
    );
};
export default WorkspaceIdPage;

