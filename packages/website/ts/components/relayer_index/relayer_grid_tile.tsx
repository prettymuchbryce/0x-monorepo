import { constants as sharedConstants, Styles } from '@0xproject/react-shared';
import * as _ from 'lodash';
import { GridTile } from 'material-ui/GridList';
import * as React from 'react';
import { analytics } from 'ts/utils/analytics';

import { TopTokens } from 'ts/components/relayer_index/relayer_top_tokens';
import { Container } from 'ts/components/ui/container';
import { Image } from 'ts/components/ui/image';
import { Island } from 'ts/components/ui/island';
import { colors } from 'ts/style/colors';
import { WebsiteBackendRelayerInfo } from 'ts/types';

export interface RelayerGridTileProps {
    relayerInfo: WebsiteBackendRelayerInfo;
    networkId: number;
}

const styles: Styles = {
    root: {
        boxSizing: 'border-box',
    },
    innerDiv: {
        padding: 6,
        height: '100%',
        boxSizing: 'border-box',
    },
    header: {
        height: '50%',
        width: '100%',
        borderBottomRightRadius: 4,
        borderBottomLeftRadius: 4,
        borderTopRightRadius: 4,
        borderTopLeftRadius: 4,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: colors.walletBorder,
    },
    body: {
        paddingLeft: 6,
        paddingRight: 6,
        height: '50%',
        width: '100%',
        boxSizing: 'border-box',
    },
    weeklyTradeVolumeLabel: {
        fontSize: 14,
        color: colors.mediumBlue,
    },
    subLabel: {
        fontSize: 12,
        color: colors.lightGrey,
    },
    relayerNameLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.black,
    },
};

const FALLBACK_IMG_SRC = '/images/landing/hero_chip_image.png';
const FALLBACK_PRIMARY_COLOR = colors.grey200;
const NO_CONTENT_MESSAGE = '--';
const RELAYER_ICON_HEIGHT = '110px';

export const RelayerGridTile: React.StatelessComponent<RelayerGridTileProps> = (props: RelayerGridTileProps) => {
    const link = props.relayerInfo.appUrl || props.relayerInfo.url;
    const topTokens = props.relayerInfo.topTokens;
    const weeklyTxnVolume = props.relayerInfo.weeklyTxnVolume;
    const networkName = sharedConstants.NETWORK_NAME_BY_ID[props.networkId];
    const eventLabel = `${props.relayerInfo.name}-${networkName}`;
    const trackRelayerClick = () => analytics.logEvent('Portal', 'Relayer Click', eventLabel);
    const headerImageUrl = props.relayerInfo.logoImgUrl;
    const headerBackgroundColor =
        !_.isUndefined(headerImageUrl) && !_.isUndefined(props.relayerInfo.primaryColor)
            ? props.relayerInfo.primaryColor
            : FALLBACK_PRIMARY_COLOR;
    return (
        <Island style={styles.root} Component={GridTile}>
            <div style={styles.innerDiv}>
                <a href={link} target="_blank" style={{ textDecoration: 'none' }} onClick={trackRelayerClick}>
                    <div
                        className="flex items-center"
                        style={{ ...styles.header, backgroundColor: headerBackgroundColor }}
                    >
                        <Image
                            className="mx-auto"
                            src={props.relayerInfo.logoImgUrl}
                            fallbackSrc={FALLBACK_IMG_SRC}
                            height={RELAYER_ICON_HEIGHT}
                        />
                    </div>
                </a>
                <div style={styles.body}>
                    <div className="py1" style={styles.relayerNameLabel}>
                        {props.relayerInfo.name}
                    </div>
                    <Section titleText="Weekly Trade Volume">
                        {!_.isUndefined(weeklyTxnVolume) && (
                            <div style={styles.weeklyTradeVolumeLabel}>{props.relayerInfo.weeklyTxnVolume}</div>
                        )}
                    </Section>
                    <Container marginTop="10px">
                        <Section titleText="Top Tokens">
                            {!_.isEmpty(topTokens) && <TopTokens tokens={topTokens} networkId={props.networkId} />}
                        </Section>
                    </Container>
                </div>
            </div>
        </Island>
    );
};

interface SectionProps {
    titleText: string;
    children?: React.ReactNode;
}
const Section = (props: SectionProps) => {
    return (
        <div>
            <div style={styles.subLabel}>{props.titleText}</div>
            <Container marginTop="6px">{props.children || <NoContent />}</Container>
        </div>
    );
};

const NoContent = () => <div style={styles.subLabel}>{NO_CONTENT_MESSAGE}</div>;
