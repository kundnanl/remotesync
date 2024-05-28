"use client"
import { currentProfile } from "@/lib/current-profile";
import { auth } from "@clerk/nextjs/server";
import { Organization } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

const OrganizationPage = () => {
    // const [organizations, setOrganizations] = useState<Organization[]>([]);

    // const profile = currentProfile();

    // const { userId } = auth();

    // if (!profile) {
    //     return auth().redirectToSignIn();
    // }

    // useEffect(() => {
    //     const fetchOrganizations = async () => {
    //         const response = await axios.post("/api/getOrganization", {
    //             userId,
    //         });
    //         const { organization } = response.data;

    //         setOrganizations(organization);
    //     }
    //     fetchOrganizations();
    // }
    // , [userId]);

    return ( 
        <div>
            <h1>Organization Page</h1>
        </div>
     );
}
 
export default OrganizationPage;