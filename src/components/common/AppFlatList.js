/**
 * AppFlatList — themed FlatList with built-in empty state, loader, and separator
 */
import React, {memo, useCallback} from 'react';
import {FlatList, View, StyleSheet, RefreshControl} from 'react-native';
import {useTheme} from '../../theme';
import Loader from './Loader';
import EmptyState from './EmptyState';

const AppFlatList = ({
  data,
  renderItem,
  keyExtractor,
  loading = false,
  refreshing = false,
  onRefresh,
  onEndReached,
  onEndReachedThreshold = 0.4,
  ListEmptyComponent,
  emptyTitle,
  emptyDescription,
  emptyIcon,
  emptyAction,
  emptyActionLabel,
  separator,
  separatorHeight = 12,
  numColumns,
  horizontal = false,
  showsVerticalScrollIndicator = false,
  showsHorizontalScrollIndicator = false,
  contentContainerStyle,
  style,
  ...rest
}) => {
  const {colors} = useTheme();

  const ItemSeparator = useCallback(
    () =>
      separator || (
        <View style={{height: horizontal ? 0 : separatorHeight, width: horizontal ? separatorHeight : 0}} />
      ),
    [separator, separatorHeight, horizontal],
  );

  const Empty = useCallback(() => {
    if (loading) return null;
    if (ListEmptyComponent) return ListEmptyComponent;
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={emptyIcon}
        actionLabel={emptyActionLabel}
        onAction={emptyAction}
      />
    );
  }, [loading, ListEmptyComponent, emptyTitle, emptyDescription, emptyIcon, emptyAction, emptyActionLabel]);

  const Footer = useCallback(
    () =>
      loading && data?.length > 0 ? (
        <Loader visible size="small" />
      ) : null,
    [loading, data],
  );

  if (loading && (!data || data.length === 0)) {
    return <Loader fullScreen />;
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        ) : undefined
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      ListEmptyComponent={<Empty />}
      ListFooterComponent={<Footer />}
      ItemSeparatorComponent={ItemSeparator}
      numColumns={numColumns}
      horizontal={horizontal}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      contentContainerStyle={[
        !data?.length && styles.emptyContainer,
        contentContainerStyle,
      ]}
      style={style}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flexGrow: 1,
  },
});

export default memo(AppFlatList);
