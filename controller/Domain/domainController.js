const AWS = require('aws-sdk');
const route53 = new AWS.Route53();

const registerDomain = async (req, res) => {
    const { domainName } = req.body;

    try {
        const existingHostedZones = await route53.listHostedZones().promise();
        const existingDomain = existingHostedZones.HostedZones.find(zone => zone.Name === `${domainName}`);
        if (existingDomain) {
            return res.status(400).json({ error: ' Domain Already Exists' });
        }

        const params = {
            Name: domainName,
            CallerReference: `domain-${Date.now()}`,
            HostedZoneConfig: {
                Comment: `Hosted zone for ${domainName}`,
                PrivateZone: false,
            }
        }

        const createdHostedZone = await route53.createHostedZone(params).promise();
        res.status(201).json({
            message: 'Domain Register Successfully',
            hostedZone: createdHostedZone,
        })


    } catch (error) {
        console.error('Error registering domain:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getDomain = async (req, res) => {

    try {

        const HostedZones = await route53.listHostedZones().promise();
        const domains = HostedZones.HostedZones.map(zone => ({
            name: zone.Name,
            id: zone.Id.split('/').pop()
        }));

        res.status(200).json({ domain: domains });
    } catch (error) {
        console.error('Error fetching registered domains:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const deleteDomain = async (req,res) => {
    const {domainId} = req.body;
    try{
        await route53.deleteHostedZone({Id: domainId}).promise();
        res.status(204).json({message : 'Domain deleted successfully'});
    }catch (error) {
        console.error('Error deleting domain:', error);
    res.status(500).json({ error: 'Internal server error' });
    }
}

const domainInfo = (req, res) => {
    res.status(200).json({message : 'To register /domain/register - to register,   domain /domain/delete - to delete a  domain  /domain/all - to get all domains'})
}


module.exports = {
    registerDomain: registerDomain,
    getDomain: getDomain,
    deleteDomain: deleteDomain,
    domainInfo:domainInfo,
}