import {
  DescribeTasksCommand,
  DescribeTasksCommandInput,
  ECSClient,
  ListTasksCommand,
  ListTasksCommandInput,
} from '@aws-sdk/client-ecs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EConfiguration } from '@core/config';

@Injectable()
export class EcsService {
  constructor(private configService: ConfigService) {}

  getClient(): ECSClient {
    const client = new ECSClient({
      region: this.configService.get(EConfiguration.AWS_REGION),
      credentials: {
        accessKeyId: this.configService.get(EConfiguration.AWS_ACCESS_KEY_ID),
        secretAccessKey: this.configService.get(
          EConfiguration.AWS_SECRET_ACCESS_KEY,
        ),
      },
    });

    return client;
  }

  async getTaskPrivateIp(
    clusterName: string,
    serviceName: string,
  ): Promise<string | null> {
    let privateIpv4Address = null;

    try {
      const client = this.getClient();

      const listParams: ListTasksCommandInput = {
        cluster: clusterName,
        serviceName: serviceName,
      };

      const listResponse = await client.send(new ListTasksCommand(listParams));
      const taskArns = listResponse.taskArns;

      if (!taskArns.length) return;

      const describeParams: DescribeTasksCommandInput = {
        cluster: clusterName,
        tasks: taskArns,
      };

      const describeResponse = await client.send(
        new DescribeTasksCommand(describeParams),
      );

      const container = describeResponse.tasks[0].containers[0];

      privateIpv4Address = container.networkInterfaces[0].privateIpv4Address;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.trace(error);
    }

    return privateIpv4Address;
  }
}
