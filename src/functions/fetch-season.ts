import winston from 'winston';
import functions, { CloudEvent } from '@google-cloud/functions-framework';
import { LoggingWinston } from '@google-cloud/logging-winston';
import { MessagePublishedData } from '@google/events/cloud/pubsub/v1/MessagePublishedData.js';

import {
  fetchSeasonWeekList,
  fetchSeasonWeek,
  fetchSeasonWeekEventList,
  fetchEvent,
} from '../api/client.js';
import { uploadJSON } from '../lib/cloud-storage.js';
import { delayedIterator } from '../utils/index.js';

const log = winston.createLogger({
  level: 'info',
  defaultMeta: {
    service: `function:fetchSeason`,
  },
  transports: [
    new LoggingWinston({
      projectId: process.env.GCP_PROJECT_ID,
      redirectToStdout: true,
    }),
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.prettyPrint(),
  ),
});

const SEASON_TYPES = {
  1: 1, // preseason
  2: 2, // regular season
  3: 3, // postseason
};

functions.cloudEvent(
  'fetchSeason',
  async (cloudEvent: CloudEvent<MessagePublishedData>) => {
    log.info('CloudEvent recieved', {
      cloudEvent,
    });

    let seasonType = Number(cloudEvent.data?.message?.attributes?.seasonType);
    if (!seasonType || !(seasonType in SEASON_TYPES)) {
      log.warn(
        'No season type provided. Defaulting to regular season [seasonType=2]',
      );
      seasonType = 2;
    }

    log.info('Fetching seasonWeekList', { seasonType });
    const seasonWeeks = await fetchSeasonWeekList(2023, seasonType);
    if (!seasonWeeks) {
      log.error('Failed to fetch seasonWeekList', { seasonType });
      return;
    }

    try {
      log.info('Uploading seasonWeekList', { seasonType });
      await uploadJSON(
        `season-type-${seasonType}-season-weeks.json`,
        seasonWeeks,
      );
      log.info('Successfully uploaded seasonWeekList', { seasonType });
    } catch (error) {
      log.error('Failed to upload seasonWeekList', { seasonType, error });
    }

    for await (const { $ref } of delayedIterator(seasonWeeks.items, 200)) {
      log.info('Fetching seasonWeek', { $ref });
      const seasonWeek = await fetchSeasonWeek({ $ref });
      if (!seasonWeek) {
        log.error('Failed to fetch seasonWeek', { $ref });
        continue;
      }

      const seasonWeekNumber = seasonWeek.number;

      const seasonWeekEvents = await fetchSeasonWeekEventList({
        $ref: seasonWeek.events.$ref,
      });
      if (!seasonWeekEvents) {
        log.error('Failed to fetch seasonWeekEvents', { $ref });
        continue;
      }

      try {
        log.info('Uploading seasonWeekEventsList', {
          seasonType,
          seasonWeekNumber,
        });
        await uploadJSON(
          `season-type-${seasonType}-season-week-${seasonWeekNumber}-events.json`,
          seasonWeekEvents,
        );
        log.info('Successfully uploaded seasonWeekEventsList', {
          seasonType,
          seasonWeekNumber,
        });
      } catch (error) {
        log.error('Failed to upload seasonWeekEventsList', {
          seasonType,
          seasonWeekNumber,
          error,
        });
      }

      for await (const { $ref } of delayedIterator(
        seasonWeekEvents.items,
        200,
      )) {
        log.info('Fetching event', { $ref });
        const event = await fetchEvent({ $ref });
        if (!event) {
          log.error('Failed to fetch event', { $ref });
          continue;
        }

        try {
          log.info('Uploading event', {
            seasonType,
            seasonWeekNumber,
            eventId: event.id,
          });
          await uploadJSON(
            `season-type-${seasonType}-season-week-${seasonWeekNumber}-event-${event.id}.json`,
            event,
          );
          log.info('Successfully uploaded event', {
            seasonType,
            seasonWeekNumber,
            eventId: event.id,
          });
        } catch (error) {
          log.error('Failed to upload event', {
            seasonType,
            seasonWeekNumber,
            eventId: event.id,
            error,
          });
        }
      }
    }
  },
);
