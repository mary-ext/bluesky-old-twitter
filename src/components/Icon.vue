<script setup lang="ts">
const props = defineProps<{
	size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	glyph:
		| 'add'
		| 'addLight'
		| 'analytics'
		| 'arrowDown'
		| 'arrowLeft'
		| 'arrowUp'
		| 'atSymbol'
		| 'attachFile'
		| 'audioBadge'
		| 'audioMuted'
		| 'audioUnmuted'
		| 'balloon'
		| 'bird'
		| 'bookmark'
		| 'calendar'
		| 'camera'
		| 'cameraPlus'
		| 'cameraVideo'
		| 'cards'
		| 'caretDown'
		| 'caretDownLight'
		| 'caretLeft'
		| 'caretLeftLight'
		| 'caretRight'
		| 'caretRightLight'
		| 'caretUp'
		| 'caretUpLight'
		| 'cart'
		| 'check'
		| 'checkLight'
		| 'chevronDown'
		| 'chevronUp'
		| 'circleActiveAnalytics'
		| 'circleActiveBird'
		| 'circleActiveDm'
		| 'circleActiveHeart'
		| 'circleActiveList'
		| 'circleActiveMe'
		| 'circleActiveMore'
		| 'circleActiveRetweet'
		| 'circleActiveStar'
		| 'circleError'
		| 'circleMe'
		| 'circleReply'
		| 'clock'
		| 'close'
		| 'cog'
		| 'cogWithCaret'
		| 'collapseTweets'
		| 'collections'
		| 'conversation'
		| 'cover'
		| 'createMoment'
		| 'creditCard'
		| 'crescent'
		| 'crescentFilled'
		| 'crop'
		| 'cvv'
		| 'delete'
		| 'deskBell'
		| 'desktop'
		| 'device'
		| 'discover'
		| 'dm'
		| 'dmCompose'
		| 'dots'
		| 'dotsVertical'
		| 'download'
		| 'editPencil'
		| 'envelope'
		| 'fail'
		| 'filter'
		| 'follow'
		| 'follower'
		| 'following'
		| 'geo'
		| 'geoBadge'
		| 'gif'
		| 'gifBadge'
		| 'grid'
		| 'handset'
		| 'heart'
		| 'heartBadge'
		| 'home'
		| 'homeFilled'
		| 'horizontalBarChart'
		| 'info'
		| 'imageCrop'
		| 'lifeline'
		| 'lifelineBadge'
		| 'lightning'
		| 'lightningBadge'
		| 'lightningFilled'
		| 'list'
		| 'listBadge'
		| 'logo'
		| 'magicrecs'
		| 'markAllRead'
		| 'me'
		| 'meFilled'
		| 'media'
		| 'mediaCollapse'
		| 'mediaDocking'
		| 'mediaExpand'
		| 'menu'
		| 'message'
		| 'moderator'
		| 'muted'
		| 'newsBadge'
		| 'notifications'
		| 'notificationsFilled'
		| 'notificationsDisabled'
		| 'pause'
		| 'periscopeBadge'
		| 'person'
		| 'people'
		| 'photo'
		| 'pinned'
		| 'play'
		| 'poll'
		| 'pollBar'
		| 'promoted'
		| 'promotedStroked'
		| 'promotedTrend'
		| 'promoteMode'
		| 'protected'
		| 'refresh'
		| 'reply'
		| 'report'
		| 'retweet'
		| 'retweeted'
		| 'search'
		| 'share'
		| 'smileRating1'
		| 'smileRating1Fill'
		| 'smileRating2'
		| 'smileRating2Fill'
		| 'smileRating3'
		| 'smileRating3Fill'
		| 'smileRating4'
		| 'smileRating4Fill'
		| 'smileRating5'
		| 'smileRating5Fill'
		| 'smiley'
		| 'snapReelBadge'
		| 'soundOff'
		| 'soundOn'
		| 'stickerBadge'
		| 'summary'
		| 'tablet'
		| 'top'
		| 'translator'
		| 'truck'
		| 'tweet'
		| 'unfollow'
		| 'unmuted'
		| 'url'
		| 'vineBadge'
		| 'visibilityFollowers'
		| 'visibilityFollowing'
		| 'visibilityMutual'
		| 'visibilityOnlyMe'
		| 'visibilityPublic'
		| 'warning'
		| 'laptop'
		| 'verified'
		| 'playButton';
}>();
</script>

<template>
	<span :class="`icon size--${props.size} glyph--${props.glyph}`"></span>
</template>

<style>
.icon {
	display: inline-block;
	position: relative;
	vertical-align: baseline;
	background: transparent;
	font-style: normal;
}

.icon::before {
	display: block;
	font-style: normal;
	font-weight: normal;
	font-family: 'EdgeIcons';
	text-align: center;
}

/** Size */
.size--xs {
	font-size: 12px;
	line-height: 12px;
}

.size--sm {
	font-size: 16px;
	line-height: 15px;
}

.size--md {
	font-size: 18px;
	line-height: 18px;
}

.size--lg {
	font-size: 21px;
	line-height: 1;
}

.size--xl {
	font-size: 32px;
	line-height: 1;
}

/** Glyph */
.glyph--add::before {
	content: '\f183';
}

.glyph--addLight::before {
	content: '\f198';
}

.glyph--analytics::before {
	content: '\f200';
}

.glyph--arrowDown::before {
	content: '\f174';
}

.glyph--arrowLeft::before {
	-ms-transform: scaleX(-1);
	transform: scaleX(-1);
	content: '\f114';
}

.glyph--arrowUp::before {
	content: '\f188';
}

.glyph--atSymbol::before {
	content: '\f050';
}

.glyph--attachFile::before {
	content: '\f088';
}

.glyph--audioBadge::before {
	content: '\f311';
}

.glyph--audioMuted::before {
	content: '\f306';
}

.glyph--audioUnmuted::before {
	content: '\f305';
}

.glyph--balloon::before {
	content: '\f092';
}

.glyph--bird::before {
	content: '\f179';
}

.glyph--bookmark::before {
	content: '\f155';
}

.glyph--calendar::before {
	content: '\f203';
}

.glyph--camera::before {
	content: '\f027';
}

.glyph--cameraPlus::before {
	content: '\f111';
}

.glyph--cameraVideo::before {
	content: '\f030';
}

.glyph--cards::before {
	content: '\f402';
}

.glyph--caretDown::before {
	content: '\f181';
}

.glyph--caretDownLight::before {
	content: '\f196';
}

.glyph--caretLeft::before {
	content: '\f172';
}

.glyph--caretLeftLight::before {
	content: '\f193';
}

.glyph--caretRight::before {
	content: '\f173';
}

.glyph--caretRightLight::before {
	content: '\f194';
}

.glyph--caretUp::before {
	-ms-transform: scaleY(-1);
	transform: scaleY(-1);
	content: '\f181';
}

.glyph--caretUpLight::before {
	content: '\f195';
}

.glyph--cart::before {
	content: '\f095';
}

.glyph--check::before {
	content: '\f170';
}

.glyph--checkLight::before {
	content: '\f197';
}

.glyph--chevronDown::before {
	content: '\f202';
}

.glyph--chevronUp::before {
	content: '\f201';
}

.glyph--circleActiveAnalytics::before {
	content: '\f516';
}

.glyph--circleActiveBird::before {
	content: '\f520';
}

.glyph--circleActiveDm::before {
	content: '\f517';
}

.glyph--circleActiveHeart::before {
	content: '\f514';
}

.glyph--circleActiveList::before {
	content: '\f518';
}

.glyph--circleActiveMe::before {
	content: '\f519';
}

.glyph--circleActiveMore::before {
	content: '\f515';
}

.glyph--circleActiveRetweet::before {
	content: '\f512';
}

.glyph--circleActiveStar::before {
	content: '\f513';
}

.glyph--circleError::before {
	content: '\f042';
}

.glyph--circleMe::before {
	content: '\f519';
}

.glyph--circleReply::before {
	content: '\f511';
}

.glyph--clock::before {
	content: '\f177';
}

.glyph--close::before {
	content: '\f045';
}

.glyph--cog::before {
	content: '\f059';
}

.glyph--cogWithCaret::before {
	content: '\f124';
}

.glyph--collapseTweets::before {
	content: '\f051';
}

.glyph--collections::before {
	content: '\f008';
}

.glyph--conversation::before {
	content: '\f157';
}

.glyph--cover::before {
	content: '\f163';
}

.glyph--createMoment::before {
	content: '\f162';
}

.glyph--creditCard::before {
	content: '\f401';
}

.glyph--crescent::before {
	content: '\f066';
}

.glyph--crescentFilled::before {
	content: '\f567';
}

.glyph--crop::before {
	content: '\f190';
}

.glyph--cvv::before {
	content: '\f402';
}

.glyph--delete::before {
	content: '\f154';
}

.glyph--deskBell::before {
	content: '\f090';
}

.glyph--desktop::before {
	content: '\f087';
}

.glyph--device::before {
	content: '\f085';
}

.glyph--discover::before {
	content: '\f052';
}

.glyph--dm::before {
	content: '\f054';
}

.glyph--dmCompose::before {
	content: '\f035';
}

.glyph--dots::before {
	content: '\f150';
}

.glyph--dotsVertical::before {
	content: '\f149';
}

.glyph--download::before {
	content: '\f185';
}

.glyph--editPencil::before {
	content: '\f112';
}

.glyph--envelope::before {
	content: '\f187';
}

.glyph--fail::before {
	content: '\f000';
}

.glyph--filter::before {
	content: '\f138';
}

.glyph--follow::before {
	content: '\f175';
}

.glyph--follower::before {
	content: '\f002';
}

.glyph--following::before {
	content: '\f176';
}

.glyph--geo::before {
	content: '\f031';
}

.glyph--geoBadge::before {
	content: '\f010';
}

.glyph--gif::before {
	content: '\f028';
}

.glyph--gifBadge::before {
	content: '\f309';
}

.glyph--grid::before {
	content: '\f046';
}

.glyph--handset::before {
	content: '\f091';
}

.glyph--heart::before {
	content: '\f148';
}

.glyph--heartBadge::before {
	content: '\f015';
}

.glyph--home::before {
	content: '\f053';
}

.glyph--homeFilled::before {
	content: '\f553';
}

.glyph--horizontalBarChart::before {
	content: '\f048';
}

.glyph--info::before {
	content: '\f209';
}

.glyph--imageCrop::before {
	content: '\f158';
}

.glyph--lifeline::before {
	content: '\f026';
}

.glyph--lifelineBadge::before {
	content: '\f000';
}

.glyph--lightning::before {
	content: '\f160';
}

.glyph--lightningBadge::before {
	content: '\f161';
}

.glyph--lightningFilled::before {
	content: '\f017';
}

.glyph--list::before {
	content: '\f094';
}

.glyph--listBadge::before {
	content: '\f012';
}

.glyph--logo::before {
	content: '\f179';
}

.glyph--magicrecs::before {
	content: '\f014';
}

.glyph--markAllRead::before {
	content: '\f036';
}

.glyph--me::before {
	content: '\f056';
}

.glyph--meFilled::before {
	content: '\f002';
}

.glyph--media::before {
	content: '\f109';
}

.glyph--mediaCollapse::before {
	content: '\f335';
}

.glyph--mediaDocking::before {
	content: '\f336';
}

.glyph--mediaExpand::before {
	content: '\f334';
}

.glyph--menu::before {
	content: '\f093';
}

.glyph--message::before {
	content: '\f054';
}

.glyph--moderator::before {
	content: '\f089';
}

.glyph--muted::before {
	content: '\f101';
}

.glyph--newsBadge::before {
	content: '\f009';
}

.glyph--notifications::before {
	content: '\f055';
}

.glyph--notificationsFilled::before {
	content: '\f019';
}

.glyph--notificationsDisabled::before {
	content: '\f037';
}

.glyph--pause::before {
	content: '\f302';
}

.glyph--periscopeBadge::before {
	content: '\f320';
}

.glyph--person::before {
	content: '\f056';
}

.glyph--people::before {
	content: '\f178';
}

.glyph--photo::before {
	content: '\f158';
}

.glyph--pinned::before {
	content: '\f003';
}

.glyph--play::before {
	content: '\f301';
}

.glyph--poll::before {
	content: '\f034';
}

.glyph--pollBar::before {
	content: '\f199';
}

.glyph--promoted::before {
	content: '\f004';
}

.glyph--promotedStroked::before {
	content: '\f504';
}

.glyph--promotedTrend::before {
	content: '\f011';
}

.glyph--promoteMode::before {
	content: '\f409';
}

.glyph--protected::before {
	content: '\f096';
}

.glyph--refresh::before {
	content: '\f189';
}

.glyph--reply::before {
	content: '\f151';
}

.glyph--report::before {
	content: '\e609';
}

.glyph--retweet::before {
	content: '\f152';
}

.glyph--retweeted::before {
	content: '\f006';
}

.glyph--search::before {
	content: '\f058';
}

.glyph--share::before {
	content: '\f185';
}

.glyph--smileRating1::before {
	content: '\f430';
}

.glyph--smileRating1Fill::before {
	content: '\f431';
}

.glyph--smileRating2::before {
	content: '\f432';
}

.glyph--smileRating2Fill::before {
	content: '\f433';
}

.glyph--smileRating3::before {
	content: '\f434';
}

.glyph--smileRating3Fill::before {
	content: '\f435';
}

.glyph--smileRating4::before {
	content: '\f436';
}

.glyph--smileRating4Fill::before {
	content: '\f437';
}

.glyph--smileRating5::before {
	content: '\f438';
}

.glyph--smileRating5Fill::before {
	content: '\f439';
}

.glyph--smiley::before {
	content: '\f033';
}

.glyph--snapReelBadge::before {
	content: '\f312';
}

.glyph--soundOff::before {
	content: '\f306';
}

.glyph--soundOn::before {
	content: '\f305';
}

.glyph--stickerBadge::before {
	content: '\f047';
}

.glyph--summary::before {
	content: '\f156';
}

.glyph--tablet::before {
	content: '\f086';
}

.glyph--top::before {
	content: '\f007';
}

.glyph--translator::before {
	content: '\f089';
}

.glyph--truck::before {
	content: '\f400';
}

.glyph--tweet::before {
	content: '\f029';
}

.glyph--unfollow::before {
	content: '\f097';
}

.glyph--unmuted::before {
	content: '\f101';
}

.glyph--url::before {
	content: '\f098';
}

.glyph--vineBadge::before {
	content: '\f310';
}

.glyph--visibilityFollowers::before {
	content: '\f103';
}

.glyph--visibilityFollowing::before {
	content: '\f105';
}

.glyph--visibilityMutual::before {
	content: '\f104';
}

.glyph--visibilityOnlyMe::before {
	content: '\f106';
}

.glyph--visibilityPublic::before {
	content: '\f102';
}

.glyph--warning::before {
	content: '\f182';
}

.glyph--laptop::before {
	content: '\f084';
}

.glyph--verified::before {
	content: '\f099';
}

.glyph--playButton::before {
	content: '\f040';
}
</style>
