/*
 *  Copyright 2022 Collate.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { Collapse, Row, Skeleton, Typography } from 'antd';
import { isEmpty, isUndefined } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SummaryEntityType } from '../../../../enums/EntitySummary.enum';
import './summary-list.less';
import { SummaryListProps } from './SummaryList.interface';
import SummaryListItems from './SummaryListItems/SummaryListItems.component';

const { Text } = Typography;

export default function SummaryList({
  formattedEntityData,
  entityType,
  emptyPlaceholderText,
  loading = false,
}: Readonly<SummaryListProps>) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <Row align="middle" data-testid="summary-list-loader">
        <Skeleton active paragraph={{ rows: 1 }} />
      </Row>
    );
  }

  return (
    <Row align="middle" data-testid="summary-list">
      {isEmpty(formattedEntityData) ? (
        <div>
          <Text className="no-data-chip-placeholder">
            {emptyPlaceholderText ?? t('message.no-data-available')}
          </Text>
        </div>
      ) : (
        formattedEntityData.map((entity) =>
          isEmpty(entity.children) || isUndefined(entity.children) ? (
            <SummaryListItems
              entityDetails={entity}
              isColumnsData={entityType === SummaryEntityType.COLUMN}
              key={`${entity.name}-summary-list-item`}
            />
          ) : (
            <Collapse
              ghost
              className="summary-list-collapse w-full"
              collapsible="icon"
              key={`${entity.name}-collapse`}>
              <Collapse.Panel
                data-testid={`${entity.name}-collapse`}
                header={
                  <SummaryListItems
                    entityDetails={entity}
                    isColumnsData={entityType === SummaryEntityType.COLUMN}
                  />
                }
                key={`${entity.name}-collapse-panel`}>
                <SummaryList
                  entityType={entityType}
                  formattedEntityData={entity.children}
                />
              </Collapse.Panel>
            </Collapse>
          )
        )
      )}
    </Row>
  );
}
