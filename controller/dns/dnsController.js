const AWS = require('aws-sdk');

const route53 = new AWS.Route53();



const getMultiDNS = async (req, res) => {
    try {
        const { hostedZoneId } = req.body;
        
        const params = {
            HostedZoneId: hostedZoneId,
        };
        console.log(hostedZoneId);

        const data = await route53.listResourceRecordSets(params).promise();
        return res.status(200).json({data : data.ResourseRecordsSets});

    } catch (error) {
        console.error('Error in getting multiple DNS Record', error);
        res.status(500).json({ error: 'Internal server error' , err:error});
    }

}

function isIPv4(value) {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    return ipv4Regex.test(value);
}

const createOneDNS = async (req, res) => {
    const { hostedZoneId, domainName, type, TTL, value } = req.body;

    if (!isIPv4(value)) {
        return res.status(400).json({ message: "Invalid IPv4 address" });
    }

    try {
        const param = {
            HostedZoneId: hostedZoneId,
            ChangeBatch: {
                Changes: [
                    {
                        Action: 'CREATE',
                        ResourceRecordSet: {
                            Name: domainName,
                            Type: type,
                            TTL: TTL,
                            ResourceRecords: [
                                {
                                    Value: value
                                }
                            ]
                        }
                    }
                ]
            }
        };

        const data = await route53.changeResourceRecordSets(param).promise();
        console.log("DNS record Created Successfully ", data);
        res.status(200).json({ message: "DNS record Created Successfully", data: data });

    } catch (error) {
        console.error('Error creating DNS record:', error);
        res.status(500).json({ message: 'Error creating DNS record' });
    }
}

const createMultipleDNS = async (req, res) => {

    const { hostedZoneId, dnsRecord } = req.body;
    try {
        const params = {
            HostedZoneId: hostedZoneId,
            ChangeBatch: {
                Changes: dnsRecord.map(record => ({
                    Action: 'CREATE',
                    ResourceRecordSet: {
                        Name: record.name,
                        Type: record.type,
                        TTL: record.TTL,
                        ResourceRecords: [{
                            Value: record.value
                        }]
                    }
                }))
            }
        };

        const data = await route53.changeResourceRecordSets(params).promise();

        res.status(200).json(data);


    } catch (error) {
        onsole.error('Error creating DNS records:', error);
        res.status(500).json({ message: 'Error creating DNS record' });
    }

}

const updateDNS = async (req, res) => {

    try {
        const { hostedZoneId, dnsRecord } = req.body;
        const param = {
            HostedZoneId: hostedZoneId,
            ChangeBatch: {
                Changes: dnsRecord.map(record => ({
                    Action: 'UPSERT',
                    ResourceRecordSet: {
                        Name: record.name,
                        Type: record.type,
                        TTL: record.TTL || 3600,
                        ResourceRecords: [{ Value: record.value }]
                    }
                }))
            }
        };

        const data = await route53.changeResourceRecordSets(param).promise();
        
        res.status(200).json(data);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to update DNS records' });
    }

}

const deleteDNS = async (req, res) => {

    try {
        const { hostedZoneId, dnsRecord } = req.body;
        const param = {
            HostedZoneId: hostedZoneId,
            ChangeBatch: {
                Changes: dnsRecord.map(record => ({
                    Action: 'DELETE',
                    ResourceRecordSet: {
                        Name: record.name,
                        Type: record.type,
                        TTL: record.TTL,
                        ResourceRecords: [{ Value: record.value }]
                    }
                }))
            }
        };

        const data = await route53.changeResourceRecordSets(param).promise();
        
        res.status(200).json(data);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to sdelete DNS records' });
    }

}

module.exports = {

    getMultiDNS: getMultiDNS,
    createOneDNS: createOneDNS,
    createMultipleDNS: createMultipleDNS,
    updateDNS: updateDNS,
    deleteDNS: deleteDNS
}